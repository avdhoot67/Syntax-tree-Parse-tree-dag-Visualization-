import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SAMPLE_EXPRESSIONS = [
  'a = b * c + b * c',
  'x = a + b * c - d',
  'y = (a + b) * (a + b)',
  'z = 2 * 3 + 4 * 5',
  'result = a * b + a * b - c / d',
  'w = (x + y) * (x + y) + z',
];

export const COMPILER_PHASES = [
  {
    id: 'lexical',
    title: 'Lexical Analysis',
    description: 'Breaks the source code into tokens — the basic building blocks like identifiers, numbers, and operators.',
    icon: 'Scan',
  },
  {
    id: 'parse-tree',
    title: 'Parse Tree',
    description: 'Constructs a full derivation tree showing how the expression matches the grammar rules step by step.',
    icon: 'GitBranch',
  },
  {
    id: 'syntax-tree',
    title: 'Syntax Tree (AST)',
    description: 'Simplifies the parse tree into an Abstract Syntax Tree by removing redundant grammar nodes.',
    icon: 'Network',
  },
  {
    id: 'dag',
    title: 'DAG',
    description: 'Directed Acyclic Graph that identifies and merges common subexpressions to avoid redundant computation.',
    icon: 'Share2',
  },
  {
    id: 'tac',
    title: 'Three Address Code',
    description: 'Intermediate representation where each instruction has at most three operands — closer to machine code.',
    icon: 'Code',
  },
  {
    id: 'optimization',
    title: 'Optimization',
    description: 'Applies techniques like CSE, constant folding, and dead code elimination to produce efficient code.',
    icon: 'Zap',
  },
];
