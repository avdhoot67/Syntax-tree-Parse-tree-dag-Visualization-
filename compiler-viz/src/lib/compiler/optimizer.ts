import { TACInstruction, OptimizationResult, OptimizationLog } from './types';

/**
 * Code Optimizer implementing:
 * - Common Subexpression Elimination (CSE)
 * - Constant Folding
 * - Dead Temporary Elimination
 */
export class Optimizer {
  optimize(tac: TACInstruction[]): OptimizationResult {
    const log: OptimizationLog[] = [];
    let instructions = this.cloneInstructions(tac);

    // Phase 1: Constant Folding
    instructions = this.constantFolding(instructions, log);

    // Phase 2: Common Subexpression Elimination
    instructions = this.commonSubexpressionElimination(instructions, log);

    // Phase 3: Dead Temporary Elimination
    instructions = this.deadTempElimination(instructions, log);

    // Re-number instructions
    instructions = instructions.map((inst, idx) => ({ ...inst, id: idx }));

    return {
      original: tac,
      optimized: instructions,
      log,
    };
  }

  private constantFolding(
    instructions: TACInstruction[],
    log: OptimizationLog[]
  ): TACInstruction[] {
    return instructions.map((inst) => {
      const arg1Num = parseFloat(inst.arg1);
      const arg2Num = parseFloat(inst.arg2);

      if (!isNaN(arg1Num) && !isNaN(arg2Num) && ['+', '-', '*', '/'].includes(inst.op)) {
        let result: number;
        switch (inst.op) {
          case '+': result = arg1Num + arg2Num; break;
          case '-': result = arg1Num - arg2Num; break;
          case '*': result = arg1Num * arg2Num; break;
          case '/': result = arg2Num !== 0 ? arg1Num / arg2Num : NaN; break;
          default: return inst;
        }

        if (!isNaN(result)) {
          const before = `${inst.result} = ${inst.arg1} ${inst.op} ${inst.arg2}`;
          const after = `${inst.result} = ${result}`;
          log.push({
            type: 'constant_fold',
            description: `Constant folding: ${before} → ${after}`,
            before,
            after,
          });
          return { ...inst, op: '=', arg1: String(result), arg2: '' };
        }
      }
      return inst;
    });
  }

  private commonSubexpressionElimination(
    instructions: TACInstruction[],
    log: OptimizationLog[]
  ): TACInstruction[] {
    const exprMap: Record<string, string> = {};
    const result: TACInstruction[] = [];

    for (const inst of instructions) {
      if (['+', '-', '*', '/'].includes(inst.op)) {
        const key = `${inst.arg1}${inst.op}${inst.arg2}`;
        if (exprMap[key]) {
          const before = `${inst.result} = ${inst.arg1} ${inst.op} ${inst.arg2}`;
          const after = `${inst.result} = ${exprMap[key]}`;
          log.push({
            type: 'cse',
            description: `CSE: "${key}" already computed as ${exprMap[key]}`,
            before,
            after,
          });
          result.push({ ...inst, op: '=', arg1: exprMap[key], arg2: '' });
        } else {
          exprMap[key] = inst.result;
          result.push(inst);
        }
      } else {
        result.push(inst);
      }
    }

    return result;
  }

  private deadTempElimination(
    instructions: TACInstruction[],
    log: OptimizationLog[]
  ): TACInstruction[] {
    // Find all temps that are used as arguments
    const usedTemps = new Set<string>();
    for (const inst of instructions) {
      if (inst.arg1) usedTemps.add(inst.arg1);
      if (inst.arg2) usedTemps.add(inst.arg2);
    }

    // Remove instructions whose result is a temp that is never used
    return instructions.filter((inst) => {
      if (inst.result.startsWith('t') && !usedTemps.has(inst.result)) {
        log.push({
          type: 'dead_code',
          description: `Dead temp elimination: ${inst.result} is never used`,
          before: `${inst.result} = ${inst.arg1}${inst.op !== '=' ? ' ' + inst.op + ' ' + inst.arg2 : ''}`,
          after: '(removed)',
        });
        return false;
      }
      return true;
    });
  }

  private cloneInstructions(tac: TACInstruction[]): TACInstruction[] {
    return tac.map((inst) => ({ ...inst }));
  }
}
