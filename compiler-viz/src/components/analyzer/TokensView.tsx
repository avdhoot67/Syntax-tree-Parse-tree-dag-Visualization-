'use client';

import { motion } from 'framer-motion';
import type { Token } from '@/lib/compiler/types';

const tokenColorMap: Record<string, string> = {
  IDENTIFIER: 'token-identifier',
  NUMBER: 'token-number',
  PLUS: 'token-operator',
  MINUS: 'token-operator',
  MULTIPLY: 'token-operator',
  DIVIDE: 'token-operator',
  ASSIGN: 'token-assign',
  LPAREN: 'token-paren',
  RPAREN: 'token-paren',
  EOF: 'token-eof',
};

const tokenBgMap: Record<string, string> = {
  IDENTIFIER: 'bg-cyan-500/10 border-cyan-500/20',
  NUMBER: 'bg-amber-500/10 border-amber-500/20',
  PLUS: 'bg-pink-500/10 border-pink-500/20',
  MINUS: 'bg-pink-500/10 border-pink-500/20',
  MULTIPLY: 'bg-pink-500/10 border-pink-500/20',
  DIVIDE: 'bg-pink-500/10 border-pink-500/20',
  ASSIGN: 'bg-purple-500/10 border-purple-500/20',
  LPAREN: 'bg-emerald-500/10 border-emerald-500/20',
  RPAREN: 'bg-emerald-500/10 border-emerald-500/20',
  EOF: 'bg-white/5 border-white/10',
};

interface TokensViewProps {
  tokens: Token[];
}

export default function TokensView({ tokens }: TokensViewProps) {
  if (tokens.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-white/20">
        <div className="text-center">
          <div className="text-4xl mb-4">🔤</div>
          <p>Click &quot;Tokenize&quot; to start lexical analysis</p>
        </div>
      </div>
    );
  }

  const displayTokens = tokens.filter((t) => t.type !== 'EOF');

  return (
    <div className="space-y-4">
      {/* Token Badges */}
      <div className="flex flex-wrap gap-2">
        {displayTokens.map((token, i) => (
          <motion.div
            key={`${token.type}-${token.position}-${i}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, type: 'spring' }}
            className={`px-3 py-1.5 rounded-lg border ${tokenBgMap[token.type]} flex items-center gap-2`}
          >
            <span className={`font-mono font-semibold text-sm ${tokenColorMap[token.type]}`}>
              {token.value}
            </span>
            <span className="text-[10px] text-white/30 uppercase tracking-wider">
              {token.type}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Token Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-4 py-3 text-left text-white/30 font-medium">#</th>
              <th className="px-4 py-3 text-left text-white/30 font-medium">Type</th>
              <th className="px-4 py-3 text-left text-white/30 font-medium">Value</th>
              <th className="px-4 py-3 text-left text-white/30 font-medium">Position</th>
            </tr>
          </thead>
          <tbody>
            {displayTokens.map((token, i) => (
              <motion.tr
                key={`row-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-2.5 text-white/20 font-mono">{i + 1}</td>
                <td className="px-4 py-2.5">
                  <span className={`font-mono text-xs px-2 py-0.5 rounded ${tokenBgMap[token.type]} ${tokenColorMap[token.type]}`}>
                    {token.type}
                  </span>
                </td>
                <td className={`px-4 py-2.5 font-mono font-semibold ${tokenColorMap[token.type]}`}>
                  {token.value}
                </td>
                <td className="px-4 py-2.5 text-white/30 font-mono text-xs">
                  Ln {token.line}, Col {token.column}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
