import React from 'react';
import { type Edge, type Node, Position } from 'reactflow';
import type { WorkflowConfig } from '~/api/model/workflow-config';
import dagre from 'dagre';

export function useWorkflowConfigAsNodes(workflowConfig: WorkflowConfig) {
  const { nodes, edges } = React.useMemo(() => {
    const edges: Edge[] = workflowConfig.transitions.map(transition => ({
      id: `${transition.fromId}-${transition.toId}`,
      edgeType: 'smoothstep',
      animated: true,
      source: transition.fromId,
      target: transition.toId,
    }));

    const commonNodeProps = {
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };

    const inputNodes = workflowConfig.events.map(event => ({
      id: event.id,
      type: 'input',
      data: { label: event.name ?? event.id },
      position: { x: 0, y: 0 },
      ...commonNodeProps,
    }));
    const stepNodes = workflowConfig.steps.map(step => ({
      id: step.id,
      // type: 'input',
      data: { label: step.name ?? step.id },
      position: { x: 0, y: 0 },
      ...commonNodeProps,
    }));
    const nodes: Node[] = [...inputNodes, ...stepNodes];
    // return { edges, nodes }
    return getLayoutedElements(nodes, edges);
  }, [workflowConfig]);

  return {
    nodes,
    edges,
  };
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    // node.targetPosition = isHorizontal ? 'left' : 'top';
    // node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};
