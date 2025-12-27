import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { NodeData } from '../types/roadmap.types';
import styles from './NodeEditor.module.css';

interface NodeEditorProps {
  nodeData: NodeData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NodeData) => void;
  onDelete?: () => void;
}

export default function NodeEditor({
  nodeData,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: NodeEditorProps) {
  const [formData, setFormData] = useState<NodeData>({
    title: '',
    description: '',
    tags: [],
    resources: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [resourceInput, setResourceInput] = useState({ label: '', url: '' });

  useEffect(() => {
    if (nodeData) {
      setFormData({
        title: nodeData.title || '',
        description: nodeData.description || '',
        tags: nodeData.tags || [],
        resources: nodeData.resources || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        tags: [],
        resources: [],
      });
    }
    setTagInput('');
    setResourceInput({ label: '', url: '' });
  }, [nodeData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof NodeData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      handleChange('tags', [...(formData.tags || []), tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = formData.tags?.filter((_, i) => i !== index) || [];
    handleChange('tags', newTags);
  };

  const handleAddResource = () => {
    if (resourceInput.label.trim() && resourceInput.url.trim()) {
      handleChange('resources', [
        ...(formData.resources || []),
        { label: resourceInput.label.trim(), url: resourceInput.url.trim() },
      ]);
      setResourceInput({ label: '', url: '' });
    }
  };

  const handleRemoveResource = (index: number) => {
    const newResources = formData.resources?.filter((_, i) => i !== index) || [];
    handleChange('resources', newResources);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSave(formData);
      onClose();
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this node?')) {
      onDelete();
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{nodeData ? 'Edit Node' : 'Add New Node'}</h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            <X style={{ width: "1.25rem", height: "1.25rem" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Title */}
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Title <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={styles.input}
              placeholder="Enter node title"
              required
            />
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className={styles.textarea}
              placeholder="Enter node description"
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Tags</label>
            <div className={styles.tagInputGroup}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className={styles.input}
                placeholder="Add a tag and press Enter"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className={styles.addButton}
                title="Add tag"
              >
                <Plus style={{ width: "1rem", height: "1rem" }} />
              </button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className={styles.tagsList}>
                {formData.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className={styles.tagRemove}
                      aria-label={`Remove ${tag}`}
                    >
                      <X style={{ width: "0.75rem", height: "0.75rem" }} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Resources */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Resources</label>
            <div className={styles.resourceInputGroup}>
              <input
                type="text"
                value={resourceInput.label}
                onChange={(e) => setResourceInput({ ...resourceInput, label: e.target.value })}
                className={styles.input}
                placeholder="Resource label"
              />
              <input
                type="url"
                value={resourceInput.url}
                onChange={(e) => setResourceInput({ ...resourceInput, url: e.target.value })}
                className={styles.input}
                placeholder="https://example.com"
              />
              <button
                type="button"
                onClick={handleAddResource}
                className={styles.addButton}
                title="Add resource"
              >
                <Plus style={{ width: "1rem", height: "1rem" }} />
              </button>
            </div>
            {formData.resources && formData.resources.length > 0 && (
              <div className={styles.resourcesList}>
                {formData.resources.map((resource, index) => (
                  <div key={index} className={styles.resourceItem}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.resourceLink}
                    >
                      📄 {resource.label}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveResource(index)}
                      className={styles.resourceRemove}
                      aria-label={`Remove ${resource.label}`}
                    >
                      <Trash2 style={{ width: "0.875rem", height: "0.875rem" }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            {onDelete && nodeData && (
              <button
                type="button"
                onClick={handleDelete}
                className={styles.deleteButton}
              >
                <Trash2 style={{ width: "1rem", height: "1rem" }} />
                Delete Node
              </button>
            )}
            <div className={styles.actionButtons}>
              <button type="button" onClick={onClose} className={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" className={styles.saveButton}>
                {nodeData ? 'Update' : 'Create'} Node
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

