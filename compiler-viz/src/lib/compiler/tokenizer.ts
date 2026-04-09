import { Token, TokenType, CompilerError } from './types';

export class Tokenizer {
  private input: string;
  private pos: number;
  private line: number;
  private column: number;
  private tokens: Token[];
  private errors: CompilerError[];

  constructor(input: string) {
    this.input = input;
    this.pos = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
    this.errors = [];
  }

  tokenize(): { tokens: Token[]; errors: CompilerError[] } {
    while (this.pos < this.input.length) {
      this.skipWhitespace();
      if (this.pos >= this.input.length) break;

      const ch = this.input[this.pos];

      if (this.isLetter(ch)) {
        this.readIdentifier();
      } else if (this.isDigit(ch)) {
        this.readNumber();
      } else if (ch === '+') {
        this.addToken(TokenType.PLUS, '+');
      } else if (ch === '-') {
        this.addToken(TokenType.MINUS, '-');
      } else if (ch === '*') {
        this.addToken(TokenType.MULTIPLY, '*');
      } else if (ch === '/') {
        this.addToken(TokenType.DIVIDE, '/');
      } else if (ch === '=') {
        this.addToken(TokenType.ASSIGN, '=');
      } else if (ch === '(') {
        this.addToken(TokenType.LPAREN, '(');
      } else if (ch === ')') {
        this.addToken(TokenType.RPAREN, ')');
      } else {
        this.errors.push({
          message: `Unexpected character: '${ch}'`,
          position: this.pos,
          line: this.line,
          column: this.column,
        });
        this.advance();
      }
    }

    this.tokens.push({
      type: TokenType.EOF,
      value: '',
      position: this.pos,
      line: this.line,
      column: this.column,
    });

    return { tokens: this.tokens, errors: this.errors };
  }

  private skipWhitespace(): void {
    while (this.pos < this.input.length) {
      const ch = this.input[this.pos];
      if (ch === ' ' || ch === '\t') {
        this.advance();
      } else if (ch === '\n') {
        this.line++;
        this.column = 1;
        this.pos++;
      } else {
        break;
      }
    }
  }

  private readIdentifier(): void {
    const start = this.pos;
    const startCol = this.column;
    while (this.pos < this.input.length && this.isAlphanumeric(this.input[this.pos])) {
      this.advance();
    }
    const value = this.input.substring(start, this.pos);
    this.tokens.push({
      type: TokenType.IDENTIFIER,
      value,
      position: start,
      line: this.line,
      column: startCol,
    });
  }

  private readNumber(): void {
    const start = this.pos;
    const startCol = this.column;
    while (this.pos < this.input.length && this.isDigit(this.input[this.pos])) {
      this.advance();
    }
    // Handle decimal numbers
    if (this.pos < this.input.length && this.input[this.pos] === '.') {
      this.advance();
      while (this.pos < this.input.length && this.isDigit(this.input[this.pos])) {
        this.advance();
      }
    }
    const value = this.input.substring(start, this.pos);
    this.tokens.push({
      type: TokenType.NUMBER,
      value,
      position: start,
      line: this.line,
      column: startCol,
    });
  }

  private addToken(type: TokenType, value: string): void {
    this.tokens.push({
      type,
      value,
      position: this.pos,
      line: this.line,
      column: this.column,
    });
    this.advance();
  }

  private advance(): void {
    this.pos++;
    this.column++;
  }

  private isLetter(ch: string): boolean {
    return /[a-zA-Z_]/.test(ch);
  }

  private isDigit(ch: string): boolean {
    return /[0-9]/.test(ch);
  }

  private isAlphanumeric(ch: string): boolean {
    return /[a-zA-Z0-9_]/.test(ch);
  }
}
