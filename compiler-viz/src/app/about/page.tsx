'use client';

import { motion } from 'framer-motion';
import { Scan, GitBranch, Network, Share2, Code, Zap, Info, ArrowRight } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import ParticleBackground from '@/components/shared/ParticleBackground';
import GlowCard from '@/components/shared/GlowCard';
import Link from 'next/link';

const phases = [
  {
    icon: Scan,
    title: 'Phase 1: Lexical Analysis',
    description:
      'The lexer (scanner) reads the source code character by character and groups them into tokens — identifiers, numbers, operators, and delimiters. It also removes whitespace and detects invalid characters.',
    example: 'Input: "a = b + c"  →  Tokens: [id:a, =, id:b, +, id:c]',
    color: 'from-cyan-500 to-blue-600',
    glowColor: 'blue' as const,
  },
  {
    icon: GitBranch,
    title: 'Phase 2: Syntax Analysis (Parsing)',
    description:
      'The parser takes the token stream and builds a parse tree (concrete syntax tree) by matching tokens against grammar rules. It verifies that the expression follows the correct syntax using recursive descent parsing.',
    example: 'Grammar: E → T ((+|-) T)*, T → F ((*|/) F)*, F → (E) | id | num',
    color: 'from-purple-500 to-indigo-600',
    glowColor: 'purple' as const,
  },
  {
    icon: Network,
    title: 'Phase 3: Abstract Syntax Tree',
    description:
      'The AST simplifies the parse tree by removing redundant nodes like parentheses and intermediate grammar productions. It retains only the essential structure — operators as internal nodes and operands as leaves.',
    example: 'Parse tree: Expr → Term → Factor → id  →  AST: just "id"',
    color: 'from-emerald-500 to-teal-600',
    glowColor: 'emerald' as const,
  },
  {
    icon: Share2,
    title: 'Phase 4: DAG Construction',
    description:
      'A Directed Acyclic Graph merges common subexpressions. If "b * c" appears twice, the DAG creates a single node for it with two parent pointers — enabling Common Subexpression Elimination (CSE).',
    example: 'AST: has two "b*c" nodes  →  DAG: has one shared "b*c" node',
    color: 'from-pink-500 to-rose-600',
    glowColor: 'pink' as const,
  },
  {
    icon: Code,
    title: 'Phase 5: Intermediate Code Generation',
    description:
      'Three-Address Code (TAC) is generated from the AST/DAG. Each instruction has at most three operands: one operator, up to two source operands, and one destination. We also generate Quadruple and Triple representations.',
    example: 't0 = b * c, t1 = t0 + t0, t2 = t1 - d, a = t2',
    color: 'from-amber-500 to-orange-600',
    glowColor: 'blue' as const,
  },
  {
    icon: Zap,
    title: 'Phase 6: Code Optimization',
    description:
      'Optimization transforms the intermediate code to improve efficiency. Key techniques include: Common Subexpression Elimination, Constant Folding (evaluating constants at compile-time), and Dead Code Elimination (removing unused temporaries).',
    example: 't0 = 2 * 3  →  t0 = 6 (constant folding)',
    color: 'from-violet-500 to-purple-600',
    glowColor: 'purple' as const,
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navbar />

      <div className="relative z-10 pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-sm font-medium mb-6">
              <Info className="w-4 h-4" />
              Educational Reference
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Understanding the{' '}
              <span className="gradient-text">Compiler Pipeline</span>
            </h1>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              This application demonstrates the front-end phases of a compiler — from raw text to optimized intermediate code. Each phase transforms the representation closer to machine-executable form.
            </p>
          </motion.div>

          {/* Pipeline Diagram */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="glass-card p-6 overflow-x-auto">
              <div className="flex items-center justify-between min-w-[600px]">
                {['Source', 'Tokens', 'Parse Tree', 'AST', 'DAG', 'TAC', 'Optimized'].map((step, i) => (
                  <div key={step} className="flex items-center">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mx-auto mb-2">
                        <span className="text-xs font-bold text-cyan-400">{i + 1}</span>
                      </div>
                      <span className="text-xs text-white/40">{step}</span>
                    </div>
                    {i < 6 && (
                      <ArrowRight className="w-4 h-4 text-white/10 mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Phase Details */}
          <div className="space-y-6">
            {phases.map((phase, i) => (
              <GlowCard key={phase.title} glowColor={phase.glowColor} delay={i * 0.1}>
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <phase.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{phase.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed mb-3">
                      {phase.description}
                    </p>
                    <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 font-mono text-xs text-cyan-300/60">
                      {phase.example}
                    </div>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              href="/analyzer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:scale-[1.02]"
            >
              Try It Yourself
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
