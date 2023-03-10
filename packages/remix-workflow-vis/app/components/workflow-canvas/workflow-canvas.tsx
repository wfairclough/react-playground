import './workflow-canvas.css';

import React from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  type Connection,
  type ReactFlowInstance,
} from 'reactflow';

import { useWorkflowConfigAsNodes } from './useWorkflowConfigAsNodes';
import type { WorkflowConfig } from '~/api/model/workflow-config';

const minimapStyle = {
  height: 160,
};

const onInit = (reactFlowInstance: ReactFlowInstance) => {
  console.log('flow loaded:', { reactFlowInstance });
};

export interface WorkflowCanvasProps {
  workflowConfig: WorkflowConfig;
}

export const WorkflowCanvas = ({ workflowConfig }: WorkflowCanvasProps) => {
  const { nodes: layoutedNodes, edges: layoutedEdges } = useWorkflowConfigAsNodes(workflowConfig);
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const onConnect = React.useCallback((params: Connection) => setEdges(eds => addEdge(params, eds)), []);

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
