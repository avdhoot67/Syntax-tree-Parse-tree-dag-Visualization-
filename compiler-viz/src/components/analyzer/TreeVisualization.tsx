'use client';

import { useCallback, useMemo, useEffect, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  Position,
  Handle,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import type { ParseTreeNode, ASTNode } from '@/lib/compiler/types';

// ============================================================
// Custom Node Component
// ============================================================
function CompilerNode({ data }: { data: { label: string; nodeType: string; isShared?: boolean; delay?: number } }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), (data.delay || 0) * 150);
    return () => clearTimeout(timer);
  }, [data.delay]);

  const bgColor = data.nodeType === 'terminal'
    ? 'from-cyan-500/20 to-blue-600/20'
    : data.isShared
    ? 'from-pink-500/30 to-rose-600/30'
    : 'from-purple-500/20 to-indigo-600/20';

  const borderColor = data.nodeType === 'terminal'
    ? 'border-cyan-500/40'
    : data.isShared
    ? 'border-pink-500/50'
    : 'border-purple-500/30';

  const glowColor = data.nodeType === 'terminal'
    ? '0 0 20px rgba(0,212,255,0.2)'
    : data.isShared
    ? '0 0 20px rgba(244,114,182,0.3)'
    : '0 0 15px rgba(168,85,247,0.15)';

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={visible ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <Handle type="target" position={Position.Top} className="!bg-white/20 !w-2 !h-2 !border-0" />
      <div
        className={`px-4 py-2 rounded-xl bg-gradient-to-br ${bgColor} border ${borderColor} backdrop-blur-sm min-w-[60px] text-center`}
        style={{ boxShadow: glowColor }}
      >
        <span
          className={`text-sm font-semibold ${
            data.nodeType === 'terminal' ? 'text-cyan-300 font-mono' : 'text-white/90'
          }`}
        >
          {data.label}
        </span>
        {data.isShared && (
          <div className="text-[10px] text-pink-400 mt-0.5">shared</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-white/20 !w-2 !h-2 !border-0" />
    </motion.div>
  );
}

const nodeTypes = { compilerNode: CompilerNode };

// ============================================================
// Layout Helpers
// ============================================================
function getSubtreeWidth(node: ParseTreeNode): number {
  if (!node.children || node.children.length === 0) return 1;
  return node.children.reduce((sum, child) => sum + getSubtreeWidth(child), 0);
}

function layoutParseTree(
  node: ParseTreeNode,
  x: number,
  y: number,
  depth: number,
  nodes: Node[],
  edges: Edge[],
  parentId?: string
): void {
  const nodeId = node.id;
  nodes.push({
    id: nodeId,
    type: 'compilerNode',
    position: { x, y },
    data: {
      label: node.label,
      nodeType: node.type,
      delay: depth,
    },
  });

  if (parentId) {
    edges.push({
      id: `${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
      style: { stroke: 'rgba(168, 85, 247, 0.3)', strokeWidth: 2 },
      animated: true,
    });
  }

  if (node.children && node.children.length > 0) {
    const totalWidth = getSubtreeWidth(node);
    let currentX = x - (totalWidth * 80) / 2;

    for (const child of node.children) {
      const childWidth = getSubtreeWidth(child);
      const childX = currentX + (childWidth * 80) / 2;
      layoutParseTree(child, childX, y + 100, depth + 1, nodes, edges, nodeId);
      currentX += childWidth * 80;
    }
  }
}

function getASTSubtreeWidth(node: ASTNode): number {
  if (!node.left && !node.right) return 1;
  let w = 0;
  if (node.left) w += getASTSubtreeWidth(node.left);
  if (node.right) w += getASTSubtreeWidth(node.right);
  return w || 1;
}

function layoutAST(
  node: ASTNode,
  x: number,
  y: number,
  depth: number,
  nodes: Node[],
  edges: Edge[],
  parentId?: string
): void {
  const nodeId = node.id;
  let label = '';
  if (node.type === 'assignment') label = '=';
  else if (node.type === 'binary_op') label = node.operator || '';
  else if (node.type === 'identifier') label = node.name || '';
  else if (node.type === 'number') label = String(node.value);

  const isLeaf = !node.left && !node.right;

  nodes.push({
    id: nodeId,
    type: 'compilerNode',
    position: { x, y },
    data: {
      label,
      nodeType: isLeaf ? 'terminal' : 'non-terminal',
      delay: depth,
    },
  });

  if (parentId) {
    edges.push({
      id: `${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
      style: { stroke: 'rgba(52, 211, 153, 0.3)', strokeWidth: 2 },
      animated: true,
    });
  }

  const spacing = 100;
  if (node.left) {
    const lw = getASTSubtreeWidth(node.left);
    layoutAST(node.left, x - lw * spacing / 2, y + 100, depth + 1, nodes, edges, nodeId);
  }
  if (node.right) {
    const rw = getASTSubtreeWidth(node.right);
    layoutAST(node.right, x + rw * spacing / 2, y + 100, depth + 1, nodes, edges, nodeId);
  }
}

// ============================================================
// TreeVisualization Component
// ============================================================
interface TreeVisualizationProps {
  parseTree?: ParseTreeNode | null;
  syntaxTree?: ASTNode | null;
  mode: 'parse' | 'syntax';
}

export default function TreeVisualization({ parseTree, syntaxTree, mode }: TreeVisualizationProps) {
  const { initialNodes, initialEdges } = useMemo(() => {
    const n: Node[] = [];
    const e: Edge[] = [];

    if (mode === 'parse' && parseTree) {
      layoutParseTree(parseTree, 400, 50, 0, n, e);
    } else if (mode === 'syntax' && syntaxTree) {
      layoutAST(syntaxTree, 400, 50, 0, n, e);
    }

    return { initialNodes: n, initialEdges: e };
  }, [parseTree, syntaxTree, mode]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const isEmpty = nodes.length === 0;

  if (isEmpty) {
    return (
      <div className="h-[500px] flex items-center justify-center text-white/20">
        <div className="text-center">
          <div className="text-4xl mb-4">🌳</div>
          <p>Click &quot;Generate {mode === 'parse' ? 'Parse' : 'Syntax'} Tree&quot; to visualize</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[500px] rounded-xl overflow-hidden border border-white/5">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={2}
        className="bg-[#0a0a0f]"
      >
        <Controls className="!bottom-4 !left-4" />
        <Background color="rgba(255,255,255,0.03)" gap={30} />
      </ReactFlow>
    </div>
  );
}
