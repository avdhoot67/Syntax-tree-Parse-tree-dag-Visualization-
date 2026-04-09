'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, Calendar, ArrowRight, Trash2, Search } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import ParticleBackground from '@/components/shared/ParticleBackground';
import Link from 'next/link';

interface HistoryItem {
  id: number;
  expression: string;
  created_at?: string;
  timestamp?: string;
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Try to load from localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('compiler-history') || '[]');
      setItems(stored);
    } catch {
      // ignore
    }

    // Also try API
    fetch('/api/history')
      .then((r) => r.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setItems(data.items);
        }
      })
      .catch(() => {});
  }, []);

  const filteredItems = items.filter((item) =>
    item.expression.toLowerCase().includes(search.toLowerCase())
  );

  const clearHistory = () => {
    localStorage.removeItem('compiler-history');
    setItems([]);
  };

  const formatDate = (item: HistoryItem) => {
    const dateStr = item.created_at || item.timestamp;
    if (!dateStr) return 'Unknown date';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navbar />

      <div className="relative z-10 pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center">
                <History className="w-5 h-5 text-cyan-400" />
              </div>
              <h1 className="text-3xl font-bold gradient-text">Analysis History</h1>
            </div>
            <p className="text-white/30 ml-13">Previously analyzed expressions</p>
          </motion.div>

          {/* Search & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                placeholder="Search expressions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:border-cyan-500/30 transition-colors"
              />
            </div>
            {items.length > 0 && (
              <button
                onClick={clearHistory}
                className="px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            )}
          </motion.div>

          {/* History Items */}
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-white/40 mb-2">No analyses yet</h3>
              <p className="text-white/20 mb-6">Start analyzing expressions to build your history</p>
              <Link
                href="/analyzer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-semibold text-sm hover:shadow-[0_0_25px_rgba(0,212,255,0.25)] transition-all"
              >
                Go to Analyzer
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-4 flex items-center justify-between gap-4 hover:border-cyan-500/20 transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm text-cyan-300 truncate">
                      {item.expression}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-white/20">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item)}
                    </div>
                  </div>
                  <Link
                    href={`/analyzer?expr=${encodeURIComponent(item.expression)}`}
                    className="px-4 py-2 rounded-lg border border-white/5 bg-white/[0.02] text-white/40 text-xs font-medium group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition-all flex items-center gap-1.5"
                  >
                    View
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
