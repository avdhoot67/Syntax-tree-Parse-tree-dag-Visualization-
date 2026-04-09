// ============================================================
// Compiler Engine Type Definitions
// ============================================================

export enum TokenType {
  IDENTIFIER = 'IDENTIFIER',
  NUMBER = 'NUMBER',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  ASSIGN = 'ASSIGN',
  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
  EOF = 'EOF',
}

export interface Token {
  type: TokenType;
  value: string;
  position: number;
  line: number;
  column: number;
}

export interface ParseTreeNode {
  id: string;
  label: string;
  type: 'non-terminal' | 'terminal';
  children: ParseTreeNode[];
  value?: string;
}

export interface ASTNode {
  id: string;
  type: 'assignment' | 'binary_op' | 'identifier' | 'number';
  operator?: string;
  name?: string;
  value?: number;
  left?: ASTNode;
  right?: ASTNode;
}

export interface DAGNode {
  id: string;
  type: 'operator' | 'identifier' | 'number';
  label: string;
  operator?: string;
  value?: string | number;
  left?: string;   // reference by id
  right?: string;  // reference by id
  parents: string[];
  isShared: boolean;
  identifiers: string[]; // attached identifiers
}

export interface TACInstruction {
  id: number;
  op: string;
  arg1: string;
  arg2: string;
  result: string;
}

export interface Quadruple {
  id: number;
  op: string;
  arg1: string;
  arg2: string;
  result: string;
}

export interface Triple {
  id: number;
  op: string;
  arg1: string;
  arg2: string;
}

export interface OptimizationResult {
  original: TACInstruction[];
  optimized: TACInstruction[];
  log: OptimizationLog[];
}

export interface OptimizationLog {
  type: 'cse' | 'constant_fold' | 'dead_code' | 'copy_prop';
  description: string;
  before: string;
  after: string;
}

export interface CompilerError {
  message: string;
  position: number;
  line: number;
  column: number;
}

export interface AnalysisResult {
  expression: string;
  tokens: Token[];
  parseTree: ParseTreeNode | null;
  syntaxTree: ASTNode | null;
  dag: DAGNode[];
  tac: TACInstruction[];
  quadruples: Quadruple[];
  triples: Triple[];
  optimization: OptimizationResult | null;
  errors: CompilerError[];
  timestamp: string;
}
