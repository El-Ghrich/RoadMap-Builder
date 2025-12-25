import { Handle, Position, type NodeProps } from 'reactflow';
import styles from './CustomNode.module.css';

// Define the shape of the data based on our JSON structure
type NodeData = {
  title: string;
  description?: string;
  tags?: string[];
  resources?: { label: string; url: string }[];
};

export default function CustomNode({ data }: NodeProps<NodeData>) {
  return (
    <div className={styles.nodeContainer} style={{ cursor: 'pointer' }}>
      {/* Header (Title) */}
      <div className={styles.nodeHeader}>
        <h3 className={styles.nodeTitle}>{data.title}</h3>
      </div>

      {/* Body (Description) */}
      <div className={styles.nodeBody}>
        {data.description && (
          <p className={styles.nodeDescription}>{data.description}</p>
        )}

        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className={styles.nodeTags}>
            {data.tags.map((tag) => (
              <span key={tag} className={styles.nodeTag}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Resources */}
        {data.resources && data.resources.length > 0 && (
          <div className={styles.nodeResources}>
            <p className={styles.nodeResourcesTitle}>Resources:</p>
            {data.resources.map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.nodeResourceLink}
              >
                📄 {res.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* React Flow Handles (Input/Output dots) */}
      <Handle
        type="target"
        position={Position.Top}
        className={`${styles.handle} ${styles.handleTop}`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={`${styles.handle} ${styles.handleBottom}`}
      />
    </div>
  );
}