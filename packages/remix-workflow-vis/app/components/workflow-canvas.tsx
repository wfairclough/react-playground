import dagre from 'dagre';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  type Edge,
  MiniMap,
  type Node,
  useEdgesState,
  useNodesState,
  Connection,
  ReactFlowInstance,
  Position,
} from 'reactflow';
import { type WorkflowConfig } from './workflow-config';
import './workflow-canvas.css';

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

const minimapStyle = {
  height: 120,
};

const onInit = (reactFlowInstance: ReactFlowInstance) => {
  console.log('flow loaded:', { reactFlowInstance });
};

export interface WorkflowCanvasProps {
  workflowConfig: WorkflowConfig;
}

export function useWorkflowConfigAsNodes(workflowConfig: WorkflowConfig) {
  const { nodes, edges } = useMemo(() => {
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

export const WorkflowCanvas = ({ workflowConfig }: WorkflowCanvasProps) => {
  const { nodes: layoutedNodes, edges: layoutedEdges } = useWorkflowConfigAsNodes(workflowConfig);
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const onConnect = useCallback((params: Connection) => setEdges(eds => addEdge(params, eds)), []);

  // we are using a bit of a shortcut here to adjust the edge type
  // this could also be done with a custom edge for example
  // const edgesWithUpdatedTypes = edges.map((edge) => {
  //   if (edge.sourceHandle) {
  //     const edgeType = nodes.find((node) => node.type === 'custom').data.selects[edge.sourceHandle];
  //     if (edgeType) {
  //       edge.type = edgeType;
  //     }
  //   }

  //   return edge;
  // });

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={onInit}
      fitView
      attributionPosition="top-right"
    >
      <MiniMap style={minimapStyle} zoomable pannable />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};
