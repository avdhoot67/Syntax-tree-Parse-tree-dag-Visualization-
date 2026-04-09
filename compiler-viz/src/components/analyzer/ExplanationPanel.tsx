'use client';

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface ExplanationPanelProps {
  activePhase: string;
}

const explanations: Record<string, { title: string; what: string; why: string; how: string }> = {
  tokens: {
    title: 'Lexical Analysis (Tokenization)',
    what: 'Lexical analysis is the first phase of a compiler. It reads the raw source code character by character and groups them into meaningful sequences called tokens (lexemes).',
    why: 'Tokenization simplifies the input for the parser. It removes whitespace, identifies keywords and literals, and catches basic lexical errors like invalid characters.',
    how: 'Our tokenizer scans the expression left-to-right, matching patterns for identifiers (variable names), numbers (integer/decimal), operators (+, -, *, /, =), and parentheses.',
  },
  'parse-tree': {
    title: 'Parse Tree (Concrete Syntax Tree)',
    what: 'A parse tree is a full derivation tree that shows exactly how the expression was derived from the grammar rules. Every grammar production creates a node.',
    why: 'Parse trees prove that an expression is syntactically valid according to the grammar. They show the complete grammatical structure including all non-terminals.',
    how: 'We use a recursive descent parser with the grammar: Statement → ID = Expr, Expr → Term ((+|-) Term)*, Term → Factor ((*|/) Factor)*, Factor → (Expr) | ID | NUM.',
  },
  'syntax-tree': {
    title: 'Abstract Syntax Tree (AST)',
    what: 'An AST is a simplified tree that captures the essential structure of the expression. Unlike the parse tree, it omits parentheses, grammar productions, and other syntactic sugar.',
    why: 'ASTs are the preferred internal representation for compilers because they are simpler and more efficient to process. They focus on meaning rather than syntactic details.',
    how: 'The AST is built during parsing by directly constructing operator nodes with operand children, skipping intermediate grammar non-terminal nodes.',
  },
  dag: {
    title: 'Directed Acyclic Graph (DAG)',
    what: 'A DAG is like an AST but with shared nodes. When the same subexpression appears multiple times, the DAG merges them into a single node with multiple parents.',
    why: 'DAGs enable common subexpression elimination (CSE) — one of the most important compiler optimizations. By detecting repeated computations, we can compute them only once.',
    how: 'We use value numbering: each unique (operator, left, right) signature maps to one node. When we encounter a signature that already exists, we reuse the existing node instead of creating a new one.',
  },
  tac: {
    title: 'Three-Address Code (TAC)',
    what: 'TAC is an intermediate representation where each instruction has at most one operator, two operands, and one result. It uses temporary variables (t0, t1, ...) for intermediate values.',
    why: 'TAC is close to assembly language but machine-independent. It makes optimization and code generation straightforward because each instruction is simple and uniform.',
    how: 'We traverse the AST post-order, emitting instructions for each operator node. Results are stored in temporaries. We also generate Quadruple (op, arg1, arg2, result) and Triple (op, arg1, arg2) representations.',
  },
  optimization: {
    title: 'Code Optimization',
    what: 'Optimization transforms the intermediate code to make it more efficient while preserving its meaning. We apply CSE, constant folding, and dead code elimination.',
    why: 'Optimized code runs faster and uses fewer resources. These machine-independent optimizations can significantly reduce the number of instructions.',
    how: 'CSE: if the same expression was computed before, reuse the result. Constant folding: evaluate constant expressions at compile time. Dead code elimination: remove instructions whose results are never used.',
  },
};

export default function ExplanationPanel({ activePhase }: ExplanationPanelProps) {
  const data = explanations[activePhase] || explanations['tokens'];

  return (
    <motion.div
      key={activePhase}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-600/20 border border-purple-500/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">{data.title}</h3>
      </div>

      <div className="space-y-4">
        <div className="glass-card p-4">
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">What is it?</h4>
          <p className="text-white/50 text-sm leading-relaxed">{data.what}</p>
        </div>
        <div className="glass-card p-4">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Why does it matter?</h4>
          <p className="text-white/50 text-sm leading-relaxed">{data.why}</p>
        </div>
        <div className="glass-card p-4">
          <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">How does it work?</h4>
          <p className="text-white/50 text-sm leading-relaxed">{data.how}</p>
        </div>
      </div>
    </motion.div>
  );
}
