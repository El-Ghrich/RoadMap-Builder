import { X, ExternalLink, Tag, FileText, Link2, Calendar, BarChart3 } from 'lucide-react';
import type { NodeData } from '../types/roadmap.types';
import styles from './NodeSidebar.module.css';

interface NodeSidebarProps {
  nodeData: NodeData | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

export default function NodeSidebar({
  nodeData,
  isOpen,
  onClose,
  onEdit,
}: NodeSidebarProps) {
  if (!isOpen || !nodeData) return null;

  const stats = {
    resourceCount: nodeData.resources?.length || 0,
    tagCount: nodeData.tags?.length || 0,
    hasDescription: !!nodeData.description,
  };

  return (
    <div className={styles.sidebarOverlay} onClick={onClose}>
      <div className={styles.sidebar} onClick={(e) => e.stopPropagation()}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Node Details</h2>
          <div className={styles.sidebarActions}>
            {onEdit && (
              <button
                onClick={onEdit}
                className={styles.editButton}
                title="Edit node"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Close sidebar"
            >
              <X style={{ width: "1.25rem", height: "1.25rem" }} />
            </button>
          </div>
        </div>

        <div className={styles.sidebarContent}>
          {/* Title */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <FileText style={{ width: "1rem", height: "1rem" }} />
              <h3 className={styles.sectionTitle}>Title</h3>
            </div>
            <p className={styles.sectionValue}>{nodeData.title}</p>
          </div>

          {/* Description */}
          {nodeData.description && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <FileText style={{ width: "1rem", height: "1rem" }} />
                <h3 className={styles.sectionTitle}>Description</h3>
              </div>
              <p className={styles.sectionValue}>{nodeData.description}</p>
            </div>
          )}

          {/* Tags */}
          {nodeData.tags && nodeData.tags.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <Tag style={{ width: "1rem", height: "1rem" }} />
                <h3 className={styles.sectionTitle}>Tags</h3>
              </div>
              <div className={styles.tagsList}>
                {nodeData.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {nodeData.resources && nodeData.resources.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <Link2 style={{ width: "1rem", height: "1rem" }} />
                <h3 className={styles.sectionTitle}>Resources</h3>
              </div>
              <div className={styles.resourcesList}>
                {nodeData.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.resourceLink}
                  >
                    <ExternalLink style={{ width: "0.875rem", height: "0.875rem" }} />
                    <span>{resource.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <BarChart3 style={{ width: "1rem", height: "1rem" }} />
              <h3 className={styles.sectionTitle}>Statistics</h3>
            </div>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{stats.resourceCount}</div>
                <div className={styles.statLabel}>Resources</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{stats.tagCount}</div>
                <div className={styles.statLabel}>Tags</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{stats.hasDescription ? 'Yes' : 'No'}</div>
                <div className={styles.statLabel}>Description</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

