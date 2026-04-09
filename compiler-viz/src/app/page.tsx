'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Scan,
  GitBranch,
  Network,
  Share2,
  Code,
  Zap,
  ChevronRight,
  Sparkles,
  Cpu,
  Braces,
} from 'lucide-react';
import ParticleBackground from '@/components/shared/ParticleBackground';
import Navbar from '@/components/shared/Navbar';
import GlowCard from '@/components/shared/GlowCard';

const features = [
  {
    icon: Scan,
    title: 'Lexical Analysis',
    desc: 'Tokenize expressions into identifiers, operators, and literals with syntax highlighting.',
    color: 'from-cyan-500 to-blue-600',
    glow: 'cyan',
  },
  {
    icon: GitBranch,
    title: 'Parse Tree',
    desc: 'Full grammar-based derivation tree with animated organic growth from root to leaves.',
    color: 'from-purple-500 to-indigo-600',
    glow: 'purple',
  },
  {
    icon: Network,
    title: 'Syntax Tree (AST)',
    desc: 'Simplified abstract syntax tree that strips away redundant grammar nodes.',
    color: 'from-emerald-500 to-teal-600',
    glow: 'emerald',
  },
  {
    icon: Share2,
    title: 'DAG Generator',
    desc: 'Directed acyclic graph with merged common subexpressions highlighted.',
    color: 'from-pink-500 to-rose-600',
    glow: 'pink',
  },
  {
    icon: Code,
    title: 'Three Address Code',
    desc: 'Intermediate representation in TAC, Quadruples, and Triples formats.',
    color: 'from-amber-500 to-orange-600',
    glow: 'blue',
  },
  {
    icon: Zap,
    title: 'Optimization',
    desc: 'CSE elimination, constant folding, and dead code removal with diff view.',
    color: 'from-violet-500 to-purple-600',
    glow: 'purple',
  },
];

const pipelineSteps = [
  { step: '01', title: 'Input Expression', desc: 'Enter an arithmetic or assignment expression', icon: Braces },
  { step: '02', title: 'Tokenize', desc: 'Break into tokens via lexical analysis', icon: Scan },
  { step: '03', title: 'Parse', desc: 'Build parse tree from grammar rules', icon: GitBranch },
  { step: '04', title: 'Abstract', desc: 'Simplify into AST representation', icon: Network },
  { step: '05', title: 'Optimize', desc: 'Generate DAG, TAC, and optimize', icon: Zap },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navbar />

      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="absolute inset-0 animated-bg" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Interactive Compiler Visualization Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            <span className="text-white">Compiler Expression</span>
            <br />
            <span className="gradient-text">Analyzer & Optimizer</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Visualize how compilers process expressions — from tokenization to
            optimization — with stunning animated trees, DAGs, and
            interactive code analysis.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link
              href="/analyzer"
              className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-semibold text-base transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:scale-[1.02]"
            >
              <Cpu className="w-5 h-5" />
              Start Analyzing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/10 rounded-xl text-white/70 font-medium text-base hover:border-white/20 hover:text-white transition-all duration-300"
            >
              View Features
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-16 glass-card p-1 max-w-3xl mx-auto neon-glow-blue"
          >
            <div className="bg-[#0d0d14] rounded-[14px] p-6 font-mono text-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-white/30 text-xs ml-2">expression-analyzer.ts</span>
              </div>
              <div className="space-y-1 text-left">
                <p><span className="text-purple-400">const</span> <span className="text-cyan-300">expr</span> <span className="text-pink-400">=</span> <span className="text-amber-300">&quot;a = b * c + b * c - d&quot;</span></p>
                <p className="text-white/30">{'// '}Tokenize → Parse → AST → DAG → TAC → Optimize</p>
                <p><span className="text-purple-400">const</span> <span className="text-cyan-300">tokens</span> <span className="text-pink-400">=</span> <span className="text-emerald-400">tokenize</span>(expr)    <span className="text-white/20">{'// '}9 tokens</span></p>
                <p><span className="text-purple-400">const</span> <span className="text-cyan-300">tree</span> <span className="text-pink-400">=</span> <span className="text-emerald-400">parseTree</span>(tokens)  <span className="text-white/20">{'// '}animated growth ✨</span></p>
                <p><span className="text-purple-400">const</span> <span className="text-cyan-300">dag</span> <span className="text-pink-400">=</span> <span className="text-emerald-400">buildDAG</span>(ast)      <span className="text-white/20">{'// '}b*c merged</span></p>
                <p><span className="text-purple-400">const</span> <span className="text-cyan-300">optimized</span> <span className="text-pink-400">=</span> <span className="text-emerald-400">optimize</span>(tac) <span className="text-white/20">{'// '}CSE applied</span></p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-cyan-400" />
          </div>
        </motion.div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Compiler Phases</span> Visualized
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Every stage of compilation — from raw text to optimized intermediate code — beautifully rendered.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <GlowCard
                key={f.title}
                glowColor={f.glow as 'blue' | 'purple' | 'emerald' | 'pink'}
                delay={i * 0.1}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              How the <span className="gradient-text">Pipeline</span> Works
            </h2>
            <p className="text-white/40 text-lg">
              Follow an expression through every compilation phase
            </p>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-emerald-500/50 hidden md:block" />

            <div className="space-y-8">
              {pipelineSteps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="flex items-start gap-6 ml-0 md:ml-0"
                >
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                      <step.icon className="w-7 h-7 text-cyan-400" />
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className="text-xs font-bold text-cyan-500 tracking-widest">STEP {step.step}</span>
                    <h3 className="text-xl font-semibold text-white mt-1">{step.title}</h3>
                    <p className="text-white/40 mt-1">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="relative py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">
                Ready to <span className="gradient-text">Analyze</span>?
              </h2>
              <p className="text-white/40 mb-8 text-lg">
                Enter any arithmetic expression and watch the compiler pipeline unfold.
              </p>
              <Link
                href="/analyzer"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:scale-[1.02]"
              >
                <Cpu className="w-5 h-5" />
                Launch Analyzer
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span className="text-white/40 text-sm">Compiler Expression Analyzer & Optimizer</span>
          </div>
          <p className="text-white/20 text-sm">
            Built for Compiler Design — Interactive Visualization Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
