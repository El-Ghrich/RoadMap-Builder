import type { Roadmap, RoadmapData } from '../types/roadmap.types';

const STORAGE_KEY = 'roadmaps';
const CURRENT_ROADMAP_KEY = 'currentRoadmapId';

export class RoadmapStorage {
  // Get all roadmaps
  static getAllRoadmaps(): Roadmap[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const roadmaps = JSON.parse(stored);
      return roadmaps.map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading roadmaps:', error);
      return [];
    }
  }

  // Get a specific roadmap by ID
  static getRoadmap(id: string): Roadmap | null {
    const roadmaps = this.getAllRoadmaps();
    return roadmaps.find((r) => r.id === id) || null;
  }

  // Save a roadmap
  static saveRoadmap(roadmap: Roadmap): void {
    const roadmaps = this.getAllRoadmaps();
    const existingIndex = roadmaps.findIndex((r) => r.id === roadmap.id);
    
    const updatedRoadmap = {
      ...roadmap,
      updatedAt: new Date(),
    };

    if (existingIndex >= 0) {
      roadmaps[existingIndex] = updatedRoadmap;
    } else {
      roadmaps.push(updatedRoadmap);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(roadmaps));
  }

  // Create a new roadmap
  static createRoadmap(title: string, description?: string, data?: RoadmapData): Roadmap {
    const newRoadmap: Roadmap = {
      id: `roadmap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      data: data || {
        version: '1.0',
        viewport: { x: 0, y: 0, zoom: 1 },
        nodes: [],
        edges: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.saveRoadmap(newRoadmap);
    return newRoadmap;
  }

  // Delete a roadmap
  static deleteRoadmap(id: string): boolean {
    const roadmaps = this.getAllRoadmaps();
    const filtered = roadmaps.filter((r) => r.id !== id);
    
    if (filtered.length === roadmaps.length) {
      return false; // Roadmap not found
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    // Clear current roadmap if it was deleted
    const currentId = this.getCurrentRoadmapId();
    if (currentId === id) {
      this.clearCurrentRoadmap();
    }
    
    return true;
  }

  // Set current roadmap ID
  static setCurrentRoadmapId(id: string): void {
    localStorage.setItem(CURRENT_ROADMAP_KEY, id);
  }

  // Get current roadmap ID
  static getCurrentRoadmapId(): string | null {
    return localStorage.getItem(CURRENT_ROADMAP_KEY);
  }

  // Clear current roadmap
  static clearCurrentRoadmap(): void {
    localStorage.removeItem(CURRENT_ROADMAP_KEY);
  }
}

