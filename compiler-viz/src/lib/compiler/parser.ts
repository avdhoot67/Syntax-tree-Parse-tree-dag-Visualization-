import { Token, TokenType, ParseTreeNode, ASTNode, CompilerError } from './types';

let nodeCounter = 0;
function nextId(prefix: string): string {
  return `${prefix}_${nodeCounter++}`;
}

export class Parser {
  private tokens: Token[];
  private pos: number;
  private errors: CompilerError[];

  constructor(tokens: Token[]) {
    this.tokens = tokens.filter(t => t.type !== TokenType.EOF);
    // Re-add EOF at end
    this.tokens.push({
      type: TokenType.EOF,
      value: '',
      position: -1,
      line: 1,
      column: 1,
    });
    this.pos = 0;
    this.errors = [];
    nodeCounter = 0;
  }

  private current(): Token {
    return this.tokens[this.pos];
  }

  private peek(): Token {
    return this.tokens[Math.min(this.pos + 1, this.tokens.length - 1)];
  }

  private consume(type?: TokenType): Token {
    const token = this.current();
    if (type && token.type !== type) {
      this.errors.push({
        message: `Expected ${type} but found ${token.type} ('${token.value}')`,
        position: token.position,
        line: token.line,
        column: token.column,
      });
    }
    this.pos++;
    return token;
  }

  // ============================================================
  // Parse Tree Builder (full grammar structure)
  // ============================================================
  buildParseTree(): { tree: ParseTreeNode | null; errors: CompilerError[] } {
    nodeCounter = 0;
    this.pos = 0;
    this.errors = [];

    try {
      const tree = this.parseStatement();
      if (this.current().type !== TokenType.EOF) {
        this.errors.push({
          message: `Unexpected token '${this.current().value}' after expression`,
          position: this.current().position,
          line: this.current().line,
          column: this.current().column,
        });
      }
      return { tree, errors: this.errors };
    } catch (e) {
      this.errors.push({
        message: e instanceof Error ? e.message : 'Unknown parse error',
        position: this.current().position,
        line: this.current().line,
        column: this.current().column,
      });
      return { tree: null, errors: this.errors };
    }
  }

  private parseStatement(): ParseTreeNode {
    // Check if this is an assignment: ID = Expression
    if (
      this.current().type === TokenType.IDENTIFIER &&
      this.peek().type === TokenType.ASSIGN
    ) {
      const idToken = this.consume(TokenType.IDENTIFIER);
      const assignToken = this.consume(TokenType.ASSIGN);
      const expr = this.parseExpression();

      return {
        id: nextId('stmt'),
        label: 'Statement',
        type: 'non-terminal',
        children: [
          {
            id: nextId('id'),
            label: idToken.value,
            type: 'terminal',
            value: idToken.value,
            children: [],
          },
          {
            id: nextId('assign'),
            label: assignToken.value,
            type: 'terminal',
            value: assignToken.value,
            children: [],
          },
          expr,
        ],
      };
    }

    return this.parseExpression();
  }

  private parseExpression(): ParseTreeNode {
    let left = this.parseTerm();

    while (
      this.current().type === TokenType.PLUS ||
      this.current().type === TokenType.MINUS
    ) {
      const op = this.consume();
      const right = this.parseTerm();

      left = {
        id: nextId('expr'),
        label: 'Expression',
        type: 'non-terminal',
        children: [
          left,
          {
            id: nextId('op'),
            label: op.value,
            type: 'terminal',
            value: op.value,
            children: [],
          },
          right,
        ],
      };
    }

    return left;
  }

  private parseTerm(): ParseTreeNode {
    let left = this.parseFactor();

    while (
      this.current().type === TokenType.MULTIPLY ||
      this.current().type === TokenType.DIVIDE
    ) {
      const op = this.consume();
      const right = this.parseFactor();

      left = {
        id: nextId('term'),
        label: 'Term',
        type: 'non-terminal',
        children: [
          left,
          {
            id: nextId('op'),
            label: op.value,
            type: 'terminal',
            value: op.value,
            children: [],
          },
          right,
        ],
      };
    }

    return left;
  }

  private parseFactor(): ParseTreeNode {
    const token = this.current();

    if (token.type === TokenType.LPAREN) {
      this.consume(TokenType.LPAREN);
      const expr = this.parseExpression();
      this.consume(TokenType.RPAREN);
      return {
        id: nextId('factor'),
        label: 'Factor',
        type: 'non-terminal',
        children: [
          { id: nextId('lp'), label: '(', type: 'terminal', value: '(', children: [] },
          expr,
          { id: nextId('rp'), label: ')', type: 'terminal', value: ')', children: [] },
        ],
      };
    }

    if (token.type === TokenType.IDENTIFIER) {
      this.consume();
      return {
        id: nextId('id'),
        label: token.value,
        type: 'terminal',
        value: token.value,
        children: [],
      };
    }

    if (token.type === TokenType.NUMBER) {
      this.consume();
      return {
        id: nextId('num'),
        label: token.value,
        type: 'terminal',
        value: token.value,
        children: [],
      };
    }

    // Unary minus
    if (token.type === TokenType.MINUS) {
      this.consume();
      const factor = this.parseFactor();
      return {
        id: nextId('unary'),
        label: 'Unary',
        type: 'non-terminal',
        children: [
          { id: nextId('op'), label: '-', type: 'terminal', value: '-', children: [] },
          factor,
        ],
      };
    }

    throw new Error(`Unexpected token: '${token.value}' at position ${token.position}`);
  }

  // ============================================================
  // AST Builder (simplified tree)
  // ============================================================
  buildAST(): { ast: ASTNode | null; errors: CompilerError[] } {
    nodeCounter = 0;
    this.pos = 0;
    this.errors = [];

    try {
      const ast = this.parseASTStatement();
      if (this.current().type !== TokenType.EOF) {
        this.errors.push({
          message: `Unexpected token '${this.current().value}' after expression`,
          position: this.current().position,
          line: this.current().line,
          column: this.current().column,
        });
      }
      return { ast, errors: this.errors };
    } catch (e) {
      this.errors.push({
        message: e instanceof Error ? e.message : 'Unknown parse error',
        position: this.current().position,
        line: this.current().line,
        column: this.current().column,
      });
      return { ast: null, errors: this.errors };
    }
  }

  private parseASTStatement(): ASTNode {
    if (
      this.current().type === TokenType.IDENTIFIER &&
      this.peek().type === TokenType.ASSIGN
    ) {
      const idToken = this.consume(TokenType.IDENTIFIER);
      this.consume(TokenType.ASSIGN);
      const expr = this.parseASTExpression();
      return {
        id: nextId('assign'),
        type: 'assignment',
        operator: '=',
        left: {
          id: nextId('id'),
          type: 'identifier',
          name: idToken.value,
        },
        right: expr,
      };
    }
    return this.parseASTExpression();
  }

  private parseASTExpression(): ASTNode {
    let left = this.parseASTTerm();

    while (
      this.current().type === TokenType.PLUS ||
      this.current().type === TokenType.MINUS
    ) {
      const op = this.consume();
      const right = this.parseASTTerm();
      left = {
        id: nextId('binop'),
        type: 'binary_op',
        operator: op.value,
        left,
        right,
      };
    }

    return left;
  }

  private parseASTTerm(): ASTNode {
    let left = this.parseASTFactor();

    while (
      this.current().type === TokenType.MULTIPLY ||
      this.current().type === TokenType.DIVIDE
    ) {
      const op = this.consume();
      const right = this.parseASTFactor();
      left = {
        id: nextId('binop'),
        type: 'binary_op',
        operator: op.value,
        left,
        right,
      };
    }

    return left;
  }

  private parseASTFactor(): ASTNode {
    const token = this.current();

    if (token.type === TokenType.LPAREN) {
      this.consume(TokenType.LPAREN);
      const expr = this.parseASTExpression();
      this.consume(TokenType.RPAREN);
      return expr;
    }

    if (token.type === TokenType.IDENTIFIER) {
      this.consume();
      return {
        id: nextId('id'),
        type: 'identifier',
        name: token.value,
      };
    }

    if (token.type === TokenType.NUMBER) {
      this.consume();
      return {
        id: nextId('num'),
        type: 'number',
        value: parseFloat(token.value),
      };
    }

    if (token.type === TokenType.MINUS) {
      this.consume();
      const factor = this.parseASTFactor();
      return {
        id: nextId('unary'),
        type: 'binary_op',
        operator: 'uminus',
        left: factor,
      };
    }

    throw new Error(`Unexpected token: '${token.value}'`);
  }
}
