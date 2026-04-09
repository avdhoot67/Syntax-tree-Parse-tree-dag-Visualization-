'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TACInstruction, Quadruple, Triple } from '@/lib/compiler/types';

interface TACViewProps {
  tac: TACInstruction[];
  quadruples: Quadruple[];
  triples: Triple[];
}

const tabs = ['TAC', 'Quadruples', 'Triples'] as const;
type TabType = typeof tabs[number];

export default function TACView({ tac, quadruples, triples }: TACViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('TAC');

  if (tac.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-white/20">
        <div className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <p>Click &quot;Generate TAC&quot; to create three-address code</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/5 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/60'
            }`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="tac-tab"
                className="absolute inset-0 rounded-md bg-cyan-500/15 border border-cyan-500/20"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'TAC' && (
          <motion.div
            key="tac"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="code-block"
          >
            {tac.map((inst, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2"
              >
                <span className="text-white/20 w-8 text-right">{i + 1}.</span>
                <span className="text-cyan-300">{inst.result}</span>
                <span className="text-purple-400">=</span>
                <span className="text-white/80">{inst.arg1}</span>
                {inst.op !== '=' && (
                  <>
                    <span className="text-pink-400">{inst.op}</span>
                    <span className="text-white/80">{inst.arg2}</span>
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'Quadruples' && (
          <motion.div
            key="quad"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 text-left text-white/30 font-medium">#</th>
                  <th className="px-4 py-3 text-left text-white/30 font-medium">Op</th>
                  <th className="px-4 py-3 text-left text-white/30 font-medium">Arg1</th>
                  <th className="px-4 py-3 text-left text-white/30 font-medium">Arg2</th>
                  <th className="px-4 py-3 text-left text-white/30 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {quadruples.map((q, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-2.5 text-white/20 font-mono">{i}</td>
                    <td className="px-4 py-2.5 text-pink-400 font-mono">{q.op}</td>
                    <td className="px-4 py-2.5 text-white/70 font-mono">{q.arg1 || '—'}</td>
                    <td className="px-4 py-2.5 text-white/70 font-mono">{q.arg2 || '—'}</td>
                    <td className="px-4 py-2.5 text-cyan-300 font-mono">{q.result}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {activeTab === 'Triples' && (
          <motion.div
            key="triples"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 text-left text-white/30 font-medium">#</th>
                  <th className="px-4 py-3 text-left text-white/30 font-medium">Op</th>
                  <th className="px-4 py-3 text-left text-white/30 font-medium">Arg1</th>
                  <th className="px-4 py-3 text-left text-white/30 font-medium">Arg2</th>
                </tr>
              </thead>
              <tbody>
                {triples.map((t, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-2.5 text-white/20 font-mono">({i})</td>
                    <td className="px-4 py-2.5 text-pink-400 font-mono">{t.op}</td>
                    <td className="px-4 py-2.5 text-white/70 font-mono">{t.arg1 || '—'}</td>
                    <td className="px-4 py-2.5 text-white/70 font-mono">{t.arg2 || '—'}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
