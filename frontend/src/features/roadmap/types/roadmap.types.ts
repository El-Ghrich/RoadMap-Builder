export interface NodeData {
  title: string;
  description?: string;
  tags?: string[];
  resources?: { label: string; url: string }[];
}

export interface RoadmapNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  style?: { width?: number; height?: number };
  data: NodeData;
}

export type RoadmapStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface RoadmapEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: Record<string, any>;
}

export interface RoadmapViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface RoadmapData {
  version: string;
  viewport: RoadmapViewport;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}

export interface Roadmap {
  id: string;
  title: string;
  description?: string;
  status?: RoadmapStatus;
  data: RoadmapData;
  createdAt: Date;
  updatedAt: Date;
}

