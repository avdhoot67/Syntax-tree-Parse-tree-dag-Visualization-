import { ASTNode, TACInstruction, Quadruple, Triple } from './types';

/**
 * Three-Address Code Generator.
 * Traverses the AST and generates TAC instructions with temporaries.
 */
export class TACGenerator {
  private instructions: TACInstruction[] = [];
  private tempCounter = 0;
  private instructionCounter = 0;

  generate(ast: ASTNode): {
    tac: TACInstruction[];
    quadruples: Quadruple[];
    triples: Triple[];
  } {
    this.instructions = [];
    this.tempCounter = 0;
    this.instructionCounter = 0;

    this.processNode(ast);

    return {
      tac: this.instructions,
      quadruples: this.toQuadruples(),
      triples: this.toTriples(),
    };
  }

  private nextTemp(): string {
    return `t${this.tempCounter++}`;
  }

  private addInstruction(op: string, arg1: string, arg2: string, result: string): void {
    this.instructions.push({
      id: this.instructionCounter++,
      op,
      arg1,
      arg2,
      result,
    });
  }

  private processNode(node: ASTNode): string {
    switch (node.type) {
      case 'number':
        return String(node.value);

      case 'identifier':
        return node.name!;

      case 'assignment': {
        const rightResult = this.processNode(node.right!);
        this.addInstruction('=', rightResult, '', node.left!.name!);
        return node.left!.name!;
      }

      case 'binary_op': {
        if (node.operator === 'uminus') {
          const operand = this.processNode(node.left!);
          const temp = this.nextTemp();
          this.addInstruction('uminus', operand, '', temp);
          return temp;
        }

        const leftResult = this.processNode(node.left!);
        const rightResult = this.processNode(node.right!);
        const temp = this.nextTemp();
        this.addInstruction(node.operator!, leftResult, rightResult, temp);
        return temp;
      }

      default:
        return '';
    }
  }

  private toQuadruples(): Quadruple[] {
    return this.instructions.map((inst, idx) => ({
      id: idx,
      op: inst.op,
      arg1: inst.arg1,
      arg2: inst.arg2,
      result: inst.result,
    }));
  }

  private toTriples(): Triple[] {
    // Build a mapping from result temp to triple index
    const tempToIndex: Record<string, string> = {};
    const triples: Triple[] = [];

    this.instructions.forEach((inst, idx) => {
      let arg1 = inst.arg1;
      let arg2 = inst.arg2;

      if (tempToIndex[arg1]) arg1 = tempToIndex[arg1];
      if (tempToIndex[arg2]) arg2 = tempToIndex[arg2];

      triples.push({
        id: idx,
        op: inst.op,
        arg1,
        arg2,
      });

      if (inst.result.startsWith('t')) {
        tempToIndex[inst.result] = `(${idx})`;
      }
    });

    return triples;
  }
}
