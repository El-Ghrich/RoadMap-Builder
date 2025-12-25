import { useMemo, useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Connection,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Layout from '../../components/layout/Layout';
import CustomNode from '../../features/roadmap/components/CustomNode';
import { X, Code2 } from 'lucide-react';
import styles from './Canva.module.css';

// Mock JSON Data (Exactly what your DB returns)
const MOCK_DB_RESPONSE = {
  version: "1.0",
  viewport: { x: 0, y: 0, zoom: 1 },
  nodes: [
    {
      id: "node_1",
      type: "customNode",
      position: { x: 100, y: 100 },
      style: { width: 250 },
      data: {
        title: "Database Design",
        description: "Learn how to structure SQL and JSONB.",
        tags: ["backend", "sql"],
        resources: [{ label: "Postgres JSONB Docs", url: "https://postgresql.org" }]
      }
    },
    {
      id: "node_2",
      type: "customNode",
      position: { x: 400, y: 100 },
      style: { width: 250 },
      data: {
        title: "API Development",
        description: "Build RESTful APIs with Express and TypeScript.",
        tags: ["backend", "api"],
        resources: [
          { label: "Express Docs", url: "https://expressjs.com" },
          { label: "TypeScript Guide", url: "https://typescriptlang.org" }
        ]
      }
    },
    {
      id: "node_3",
      type: "customNode",
      position: { x: 100, y: 350 },
      style: { width: 250 },
      data: {
        title: "React Flow Integration",
        description: "Connect the frontend to the API.",
        tags: ["frontend", "ui"],
        resources: []
      }
    },
    {
      id: "node_4",
      type: "customNode",
      position: { x: 400, y: 350 },
      style: { width: 250 },
      data: {
        title: "Testing & Deployment",
        description: "Write tests and deploy your application.",
        tags: ["testing", "devops"],
        resources: [
          { label: "Jest Docs", url: "https://jestjs.io" }
        ]
      }
    }
  ],
  edges: [
    { id: "e1-2", source: "node_1", target: "node_2", animated: true },
    { id: "e1-3", source: "node_1", target: "node_3", animated: true },
    { id: "e2-4", source: "node_2", target: "node_4", animated: true },
    { id: "e3-4", source: "node_3", target: "node_4", animated: true }
  ]
};

export default function TestCanvas() {
  const [showJsonViewer, setShowJsonViewer] = useState(true);

  // Use ReactFlow's state hooks (required for v11+)
  const [nodes, , onNodesChange] = useNodesState(MOCK_DB_RESPONSE.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(MOCK_DB_RESPONSE.edges);

  // Register Custom Node Types
  const nodeTypes = useMemo(() => ({
    customNode: CustomNode,
  }), []);

  // Handle edge connections
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  // Get current JSON representation
  const currentJson = JSON.stringify(
    {
      version: MOCK_DB_RESPONSE.version,
      viewport: MOCK_DB_RESPONSE.viewport,
      nodes,
      edges,
    },
    null,
    2
  );

  return (
    <Layout>
      <div className={styles.canvasContainer}>
        <div className={styles.canvasHeader}>
          <h1 className={styles.canvasTitle}>Roadmap Canvas</h1>
          <div className={styles.canvasActions}>
            <button
              onClick={() => setShowJsonViewer(!showJsonViewer)}
              className={styles.jsonViewerToggle}
              title={showJsonViewer ? "Hide JSON" : "Show JSON"}
            >
              <Code2 style={{ width: "1.25rem", height: "1.25rem" }} />
            </button>
          </div>
        </div>

        <div className={styles.canvasWrapper}>
          <div className={styles.canvasContent}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
            >
              <Background />
              <Controls />
              <MiniMap
                nodeColor={(node) => {
                  if (node.type === 'customNode') {
                    return 'var(--primary-500)';
                  }
                  return '#ccc';
                }}
                maskColor="rgba(0, 0, 0, 0.1)"
              />
            </ReactFlow>
          </div>

          {showJsonViewer && (
            <div className={styles.jsonViewer}>
              <div className={styles.jsonViewerHeader}>
                <h3 className={styles.jsonViewerTitle}>JSON Format</h3>
                <button
                  onClick={() => setShowJsonViewer(false)}
                  className={styles.jsonViewerToggle}
                  aria-label="Close JSON viewer"
                >
                  <X style={{ width: "1rem", height: "1rem" }} />
                </button>
              </div>
              <div className={styles.jsonContent}>
                <code>{currentJson}</code>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}