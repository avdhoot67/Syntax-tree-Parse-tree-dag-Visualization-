import { ASTNode, DAGNode } from './types';

/**
 * DAG Builder using value-numbering algorithm.
 * Detects common subexpressions and merges them into shared nodes.
 */
export class DAGBuilder {
  private nodes: Map<string, DAGNode> = new Map();
  private signatureMap: Map<string, string> = new Map(); // signature -> node id
  private counter = 0;

  build(ast: ASTNode): DAGNode[] {
    this.nodes.clear();
    this.signatureMap.clear();
    this.counter = 0;

    this.processNode(ast);
    return Array.from(this.nodes.values());
  }

  private nextId(): string {
    return `dag_${this.counter++}`;
  }

  private processNode(node: ASTNode): string {
    if (node.type === 'number') {
      const sig = `NUM:${node.value}`;
      if (this.signatureMap.has(sig)) {
        return this.signatureMap.get(sig)!;
      }
      const id = this.nextId();
      this.nodes.set(id, {
        id,
        type: 'number',
        label: String(node.value),
        value: node.value,
        parents: [],
        isShared: false,
        identifiers: [],
      });
      this.signatureMap.set(sig, id);
      return id;
    }

    if (node.type === 'identifier') {
      const sig = `ID:${node.name}`;
      if (this.signatureMap.has(sig)) {
        return this.signatureMap.get(sig)!;
      }
      const id = this.nextId();
      this.nodes.set(id, {
        id,
        type: 'identifier',
        label: node.name!,
        value: node.name,
        parents: [],
        isShared: false,
        identifiers: [node.name!],
      });
      this.signatureMap.set(sig, id);
      return id;
    }

    if (node.type === 'assignment') {
      const rightId = this.processNode(node.right!);
      // Attach the assignment target to the result node
      const resultNode = this.nodes.get(rightId)!;
      if (node.left?.name && !resultNode.identifiers.includes(node.left.name)) {
        resultNode.identifiers.push(node.left.name);
      }
      return rightId;
    }

    if (node.type === 'binary_op') {
      const leftId = this.processNode(node.left!);
      const rightId = node.right ? this.processNode(node.right) : '';

      const sig = `OP:${node.operator}:${leftId}:${rightId}`;
      if (this.signatureMap.has(sig)) {
        const existingId = this.signatureMap.get(sig)!;
        const existingNode = this.nodes.get(existingId)!;
        existingNode.isShared = true;
        return existingId;
      }

      const id = this.nextId();
      const dagNode: DAGNode = {
        id,
        type: 'operator',
        label: node.operator!,
        operator: node.operator,
        left: leftId,
        right: rightId || undefined,
        parents: [],
        isShared: false,
        identifiers: [],
      };

      this.nodes.set(id, dagNode);
      this.signatureMap.set(sig, id);

      // Update parent references
      const leftNode = this.nodes.get(leftId);
      if (leftNode) leftNode.parents.push(id);
      if (rightId) {
        const rightNode = this.nodes.get(rightId);
        if (rightNode) rightNode.parents.push(id);
      }

      return id;
    }

    return '';
  }
}
