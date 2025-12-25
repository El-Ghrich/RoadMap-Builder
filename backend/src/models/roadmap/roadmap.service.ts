import { IRoadmapRepository } from "./interface/roadmap.interface";
import {
  CreateRoadmapDto,
  UpdateRoadmapDto,
  RoadmapResponseDto,
  RoadmapListItemDto,
} from "./roadmap.dto";

export class RoadmapService {
  constructor(private roadmapRepo: IRoadmapRepository) {}

  async createRoadmap(
    roadmapData: CreateRoadmapDto,
    userId: string
  ): Promise<RoadmapResponseDto> {
    const roadmap = await this.roadmapRepo.save({
      ...roadmapData,
      userId,
    });
    return RoadmapResponseDto.fromEntity(roadmap);
  }

  async getRoadmapById(id: string, userId: string): Promise<RoadmapResponseDto> {
    const roadmap = await this.roadmapRepo.findByIdAndUserId(id, userId);
    if (!roadmap) {
      throw new Error("Roadmap not found");
    }
    return RoadmapResponseDto.fromEntity(roadmap);
  }

  async getAllRoadmaps(userId: string): Promise<RoadmapListItemDto[]> {
    const roadmaps = await this.roadmapRepo.findByUserId(userId);
    return roadmaps.map((roadmap) => RoadmapListItemDto.fromEntity(roadmap));
  }

  async updateRoadmap(
    id: string,
    roadmapData: UpdateRoadmapDto,
    userId: string
  ): Promise<RoadmapResponseDto> {
    // Verify ownership
    const existingRoadmap = await this.roadmapRepo.findByIdAndUserId(id, userId);
    if (!existingRoadmap) {
      throw new Error("Roadmap not found");
    }

    const updatedRoadmap = await this.roadmapRepo.update(id, roadmapData);
    if (!updatedRoadmap) {
      throw new Error("Failed to update roadmap");
    }
    return RoadmapResponseDto.fromEntity(updatedRoadmap);
  }

  async deleteRoadmap(id: string, userId: string): Promise<void> {
    // Verify ownership
    const roadmap = await this.roadmapRepo.findByIdAndUserId(id, userId);
    if (!roadmap) {
      throw new Error("Roadmap not found");
    }

    const deleted = await this.roadmapRepo.delete(id);
    if (!deleted) {
      throw new Error("Failed to delete roadmap");
    }
  }
}

