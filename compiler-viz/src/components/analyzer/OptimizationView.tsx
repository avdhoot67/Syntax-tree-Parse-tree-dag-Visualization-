'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap, Minus, Check } from 'lucide-react';
import type { OptimizationResult } from '@/lib/compiler/types';

interface OptimizationViewProps {
  result: OptimizationResult | null;
}

const logTypeConfig = {
  cse: { label: 'CSE', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: '🔗' },
  constant_fold: { label: 'Const Fold', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: '📐' },
  dead_code: { label: 'Dead Code', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '🗑️' },
  copy_prop: { label: 'Copy Prop', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: '📋' },
};

export default function OptimizationView({ result }: OptimizationViewProps) {
  if (!result) {
    return (
      <div className="h-64 flex items-center justify-center text-white/20">
        <div className="text-center">
          <div className="text-4xl mb-4">⚡</div>
          <p>Click &quot;Optimize&quot; to apply code optimizations</p>
        </div>
      </div>
    );
  }

  const saved = result.original.length - result.optimized.length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-3 text-center">
          <div className="text-2xl font-bold text-white/80">{result.original.length}</div>
          <div className="text-xs text-white/30 mt-1">Original</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-2xl font-bold text-emerald-400">{result.optimized.length}</div>
          <div className="text-xs text-white/30 mt-1">Optimized</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-2xl font-bold text-cyan-400">{result.log.length}</div>
          <div className="text-xs text-white/30 mt-1">Optimizations</div>
        </div>
      </div>

      {saved > 0 && (
        <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-2">
          <Zap className="w-4 h-4" />
          {saved} instruction{saved > 1 ? 's' : ''} eliminated
        </div>
      )}

      {/* Before / After */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Before */}
        <div>
          <div className="text-xs text-white/30 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Minus className="w-3 h-3 text-red-400" />
            Original TAC
          </div>
          <div className="code-block text-red-300/60">
            {result.original.map((inst, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-white/15 w-6 text-right text-xs">{i + 1}</span>
                <span>{inst.result} = {inst.arg1}{inst.op !== '=' ? ` ${inst.op} ${inst.arg2}` : ''}</span>
              </div>
            ))}
          </div>
        </div>

        {/* After */}
        <div>
          <div className="text-xs text-white/30 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Check className="w-3 h-3 text-emerald-400" />
            Optimized TAC
          </div>
          <div className="code-block text-emerald-300/80">
            {result.optimized.map((inst, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-white/15 w-6 text-right text-xs">{i + 1}</span>
                <span>{inst.result} = {inst.arg1}{inst.op !== '=' ? ` ${inst.op} ${inst.arg2}` : ''}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Optimization Log */}
      {result.log.length > 0 && (
        <div>
          <div className="text-xs text-white/30 uppercase tracking-wider mb-3">Optimization Log</div>
          <div className="space-y-2">
            {result.log.map((entry, i) => {
              const config = logTypeConfig[entry.type];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-3 rounded-lg ${config.bg} border ${config.border}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>{config.icon}</span>
                    <span className={`text-xs font-bold ${config.color} uppercase tracking-wider`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm">{entry.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs font-mono">
                    <span className="text-red-300/60">{entry.before}</span>
                    <ArrowRight className="w-3 h-3 text-white/20" />
                    <span className="text-emerald-300">{entry.after}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
