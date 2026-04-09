'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan,
  GitBranch,
  Network,
  Share2,
  Code,
  Zap,
  Play,
  BookOpen,
  Loader2,
  AlertCircle,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import ParticleBackground from '@/components/shared/ParticleBackground';
import TokensView from '@/components/analyzer/TokensView';
import TACView from '@/components/analyzer/TACView';
import OptimizationView from '@/components/analyzer/OptimizationView';
import ExplanationPanel from '@/components/analyzer/ExplanationPanel';
import { SAMPLE_EXPRESSIONS } from '@/lib/utils';
import type { AnalysisResult } from '@/lib/compiler/types';

const TreeVisualization = dynamic(
  () => import('@/components/analyzer/TreeVisualization'),
  { ssr: false, loading: () => <div className="h-[500px] flex items-center justify-center text-white/20">Loading visualization...</div> }
);

const DAGVisualization = dynamic(
  () => import('@/components/analyzer/DAGVisualization'),
  { ssr: false, loading: () => <div className="h-[500px] flex items-center justify-center text-white/20">Loading visualization...</div> }
);

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false, loading: () => <div className="h-[250px] rounded-xl bg-[#0d0d14] animate-pulse" /> }
);

type TabId = 'tokens' | 'parse-tree' | 'syntax-tree' | 'dag' | 'tac' | 'optimization' | 'explanation';

const tabs: { id: TabId; label: string; icon: typeof Scan }[] = [
  { id: 'tokens', label: 'Tokens', icon: Scan },
  { id: 'parse-tree', label: 'Parse Tree', icon: GitBranch },
  { id: 'syntax-tree', label: 'Syntax Tree', icon: Network },
  { id: 'dag', label: 'DAG', icon: Share2 },
  { id: 'tac', label: 'TAC', icon: Code },
  { id: 'optimization', label: 'Optimize', icon: Zap },
  { id: 'explanation', label: 'Learn', icon: BookOpen },
];

export default function AnalyzerPage() {
  const [expression, setExpression] = useState('a = b * c + b * c - d');
  const [activeTab, setActiveTab] = useState<TabId>('tokens');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showSamples, setShowSamples] = useState(false);

  const analyze = useCallback(async (targetTab?: TabId) => {
    if (!expression.trim()) {
      setError('Please enter an expression');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: expression.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg = data.errors?.[0]?.message || data.error || 'Analysis failed';
        setError(errMsg);
        // Still set partial results if available
        if (data.tokens) {
          setResult((prev) => ({ ...prev, ...data, expression: expression.trim(), timestamp: new Date().toISOString() } as AnalysisResult));
        }
      } else {
        setResult(data as AnalysisResult);
        // Save to history (fire and forget)
        try {
          await fetch('/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
        } catch {
          // History save is non-critical
        }
        // Save to localStorage as well
        try {
          const history = JSON.parse(localStorage.getItem('compiler-history') || '[]');
          history.unshift({ ...data, id: Date.now() });
          localStorage.setItem('compiler-history', JSON.stringify(history.slice(0, 50)));
        } catch {
          // localStorage is non-critical
        }
      }

      if (targetTab) setActiveTab(targetTab);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }, [expression]);

  const handleAnalyzeAll = () => analyze('tokens');
  const handleTokenize = () => analyze('tokens');
  const handleParseTree = () => analyze('parse-tree');
  const handleSyntaxTree = () => analyze('syntax-tree');
  const handleDAG = () => analyze('dag');
  const handleTAC = () => analyze('tac');
  const handleOptimize = () => analyze('optimization');

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navbar />

      <div className="relative z-10 pt-10 pb-24 px-4 md:px-8">
        <div className="w-full max-w-[1600px] mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold">
              <span className="gradient-text">Expression Analyzer</span>
            </h1>
            <p className="text-white/30 text-sm mt-1">Enter an expression and explore the compiler pipeline</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ==================== LEFT PANEL ==================== */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-4 space-y-4"
            >
              {/* Editor Card */}
              <div className="glass-card p-6 md:p-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Expression Input</h2>
                  <div className="relative">
                    <button
                      onClick={() => setShowSamples(!showSamples)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      Samples
                      <ChevronDown className={`w-3 h-3 transition-transform ${showSamples ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showSamples && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute right-0 top-7 z-50 w-72 glass-card p-2 border border-white/10 shadow-2xl"
                        >
                          {SAMPLE_EXPRESSIONS.map((sample) => (
                            <button
                              key={sample}
                              onClick={() => {
                                setExpression(sample);
                                setShowSamples(false);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg text-sm font-mono text-white/60 hover:text-white hover:bg-white/5 transition-all"
                            >
                              {sample}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Monaco Editor */}
                <div className="rounded-xl overflow-hidden border border-white/5">
                  <MonacoEditor
                    height="180px"
                    language="plaintext"
                    theme="vs-dark"
                    value={expression}
                    onChange={(val) => setExpression(val || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 16,
                      lineNumbers: 'off',
                      glyphMargin: false,
                      folding: false,
                      wordWrap: 'on',
                      scrollBeyondLastLine: false,
                      padding: { top: 16, bottom: 16 },
                      renderLineHighlight: 'none',
                      overviewRulerLanes: 0,
                      hideCursorInOverviewRuler: true,
                      scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
                      contextmenu: false,
                    }}
                  />
                </div>

                {/* Grammar info */}
                <div className="mt-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Grammar</div>
                  <div className="font-mono text-xs text-white/40 space-y-0.5">
                    <p><span className="text-purple-400">S</span> → <span className="text-cyan-400">id</span> = <span className="text-purple-400">E</span> | <span className="text-purple-400">E</span></p>
                    <p><span className="text-purple-400">E</span> → <span className="text-purple-400">T</span> ((+|-) <span className="text-purple-400">T</span>)*</p>
                    <p><span className="text-purple-400">T</span> → <span className="text-purple-400">F</span> ((*|/) <span className="text-purple-400">F</span>)*</p>
                    <p><span className="text-purple-400">F</span> → (<span className="text-purple-400">E</span>) | <span className="text-cyan-400">id</span> | <span className="text-amber-400">num</span></p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="glass-card p-6 md:p-8 mt-6">
                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Actions</h2>

                {/* Analyze All */}
                <button
                  onClick={handleAnalyzeAll}
                  disabled={loading}
                  className="w-full mb-4 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold text-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Analyze All
                </button>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Tokenize', icon: Scan, handler: handleTokenize, color: 'cyan' },
                    { label: 'Parse Tree', icon: GitBranch, handler: handleParseTree, color: 'purple' },
                    { label: 'Syntax Tree', icon: Network, handler: handleSyntaxTree, color: 'emerald' },
                    { label: 'DAG', icon: Share2, handler: handleDAG, color: 'pink' },
                    { label: 'TAC', icon: Code, handler: handleTAC, color: 'amber' },
                    { label: 'Optimize', icon: Zap, handler: handleOptimize, color: 'violet' },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      onClick={btn.handler}
                      disabled={loading}
                      className="px-4 py-3 rounded-lg border border-white/5 bg-white/[0.02] text-white/60 text-xs font-medium hover:text-white hover:bg-white/[0.05] hover:border-white/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <btn.icon className="w-3.5 h-3.5" />
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">Syntax Error</div>
                      <div className="text-red-300/70">{error}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ==================== RIGHT PANEL ==================== */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-8"
            >
              <div className="glass-card p-6 md:p-8 min-h-full">
                {/* Tab Bar */}
                <div className="flex gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/5 mb-4 overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                          isActive ? 'text-white' : 'text-white/40 hover:text-white/80'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="output-tab"
                            className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/15 to-purple-500/15 border border-cyan-500/20"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                        <Icon className="w-3.5 h-3.5 relative z-10" />
                        <span className="relative z-10">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'tokens' && (
                      <TokensView tokens={result?.tokens || []} />
                    )}

                    {activeTab === 'parse-tree' && (
                      <TreeVisualization
                        parseTree={result?.parseTree}
                        mode="parse"
                      />
                    )}

                    {activeTab === 'syntax-tree' && (
                      <TreeVisualization
                        syntaxTree={result?.syntaxTree}
                        mode="syntax"
                      />
                    )}

                    {activeTab === 'dag' && (
                      <DAGVisualization dagData={result?.dag || []} />
                    )}

                    {activeTab === 'tac' && (
                      <TACView
                        tac={result?.tac || []}
                        quadruples={result?.quadruples || []}
                        triples={result?.triples || []}
                      />
                    )}

                    {activeTab === 'optimization' && (
                      <OptimizationView result={result?.optimization || null} />
                    )}

                    {activeTab === 'explanation' && (
                      <ExplanationPanel activePhase={activeTab} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
