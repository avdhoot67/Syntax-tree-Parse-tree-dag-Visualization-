'use client';

import { useMemo, useEffect, useState } from 'react';
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
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import type { DAGNode } from '@/lib/compiler/types';

// ============================================================
// DAG Custom Node
// ============================================================
function DAGCustomNode({ data }: { data: { label: string; isShared: boolean; identifiers: string[]; delay: number } }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), (data.delay || 0) * 200);
    return () => clearTimeout(timer);
  }, [data.delay]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={visible ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Handle type="target" position={Position.Top} className="!bg-white/20 !w-2 !h-2 !border-0" />
      <div
        className={`px-4 py-2.5 rounded-xl border backdrop-blur-sm text-center min-w-[70px] ${
          data.isShared
            ? 'bg-gradient-to-br from-pink-500/25 to-rose-600/25 border-pink-500/50'
            : 'bg-gradient-to-br from-cyan-500/15 to-blue-600/15 border-cyan-500/30'
        }`}
        style={{
          boxShadow: data.isShared
            ? '0 0 25px rgba(244,114,182,0.25)'
            : '0 0 15px rgba(0,212,255,0.1)',
        }}
      >
        <span className={`text-sm font-bold font-mono ${data.isShared ? 'text-pink-300' : 'text-cyan-300'}`}>
          {data.label}
        </span>
        {data.identifiers.length > 0 && (
          <div className="text-[10px] text-amber-400/70 mt-1">
            {data.identifiers.join(', ')}
          </div>
        )}
        {data.isShared && (
          <div className="text-[9px] text-pink-400/80 mt-0.5 font-medium tracking-wider">
            ● SHARED
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-white/20 !w-2 !h-2 !border-0" />
    </motion.div>
  );
}

const dagNodeTypes = { dagNode: DAGCustomNode };

// ============================================================
// DAG Layout
// ============================================================
function layoutDAG(dagNodes: DAGNode[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  if (dagNodes.length === 0) return { nodes, edges };

  // Build adjacency: find root(s) = nodes with no parents
  const nodeMap = new Map(dagNodes.map((n) => [n.id, n]));
  const depths = new Map<string, number>();

  function calcDepth(id: string, visited: Set<string>): number {
    if (depths.has(id)) return depths.get(id)!;
    if (visited.has(id)) return 0;
    visited.add(id);

    const node = nodeMap.get(id);
    if (!node) return 0;

    let maxChildDepth = -1;
    if (node.left) maxChildDepth = Math.max(maxChildDepth, calcDepth(node.left, visited));
    if (node.right) maxChildDepth = Math.max(maxChildDepth, calcDepth(node.right, visited));

    const d = maxChildDepth + 1;
    depths.set(id, d);
    return d;
  }

  for (const n of dagNodes) {
    calcDepth(n.id, new Set());
  }

  // Group by depth
  const maxDepth = Math.max(...Array.from(depths.values()));
  const depthGroups: Map<number, DAGNode[]> = new Map();
  for (const n of dagNodes) {
    const d = maxDepth - (depths.get(n.id) || 0);
    if (!depthGroups.has(d)) depthGroups.set(d, []);
    depthGroups.get(d)!.push(n);
  }

  // Position nodes
  for (const [depth, group] of depthGroups) {
    const totalWidth = group.length * 150;
    const startX = 400 - totalWidth / 2;
    group.forEach((n, i) => {
      nodes.push({
        id: n.id,
        type: 'dagNode',
        position: { x: startX + i * 150, y: depth * 120 + 50 },
        data: {
          label: n.type === 'operator' ? n.operator || n.label : n.label,
          isShared: n.isShared,
          identifiers: n.identifiers,
          delay: depth,
        },
      });
    });
  }

  // Edges
  for (const n of dagNodes) {
    if (n.left) {
      edges.push({
        id: `${n.id}-L-${n.left}`,
        source: n.id,
        target: n.left,
        style: {
          stroke: n.isShared ? 'rgba(244,114,182,0.4)' : 'rgba(0,212,255,0.3)',
          strokeWidth: 2,
        },
        animated: n.isShared,
        markerEnd: { type: MarkerType.ArrowClosed, color: n.isShared ? '#f472b6' : '#00d4ff' },
        label: 'L',
        labelStyle: { fill: 'rgba(255,255,255,0.3)', fontSize: 10 },
      });
    }
    if (n.right) {
      edges.push({
        id: `${n.id}-R-${n.right}`,
        source: n.id,
        target: n.right,
        style: {
          stroke: n.isShared ? 'rgba(244,114,182,0.4)' : 'rgba(0,212,255,0.3)',
          strokeWidth: 2,
        },
        animated: n.isShared,
        markerEnd: { type: MarkerType.ArrowClosed, color: n.isShared ? '#f472b6' : '#00d4ff' },
        label: 'R',
        labelStyle: { fill: 'rgba(255,255,255,0.3)', fontSize: 10 },
      });
    }
  }

  return { nodes, edges };
}

// ============================================================
// Component
// ============================================================
interface DAGVisualizationProps {
  dagData: DAGNode[];
}

export default function DAGVisualization({ dagData }: DAGVisualizationProps) {
  const { initialNodes, initialEdges } = useMemo(() => {
    const result = layoutDAG(dagData);
    return { initialNodes: result.nodes, initialEdges: result.edges };
  }, [dagData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  if (dagData.length === 0) {
    return (
      <div className="h-[500px] flex items-center justify-center text-white/20">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p>Click &quot;Generate DAG&quot; to visualize</p>
        </div>
      </div>
    );
  }

  const sharedCount = dagData.filter((n) => n.isShared).length;

  return (
    <div>
      {sharedCount > 0 && (
        <div className="mb-3 px-4 py-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-300 text-sm">
          🔗 {sharedCount} common subexpression{sharedCount > 1 ? 's' : ''} detected and merged
        </div>
      )}
      <div className="h-[500px] rounded-xl overflow-hidden border border-white/5">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={dagNodeTypes}
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
    </div>
  );
}
