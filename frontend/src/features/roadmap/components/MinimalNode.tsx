import { Handle, Position, type NodeProps } from 'reactflow';
import { FileText } from 'lucide-react';
import styles from './MinimalNode.module.css';
import type { NodeData } from '../types/roadmap.types';

export default function MinimalNode({ data }: NodeProps<NodeData>) {
  return (
    <div className={styles.minimalNodeContainer} style={{ cursor: 'pointer' }}>
      {/* Icon */}
      <div className={styles.minimalNodeIcon}>
        <FileText style={{ width: "1.25rem", height: "1.25rem" }} />
      </div>

      {/* Title */}
      <div className={styles.minimalNodeTitle}>{data.title}</div>

      {/* React Flow Handles */}
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

