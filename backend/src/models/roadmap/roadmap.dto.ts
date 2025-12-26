import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsUUID,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { RoadmapEntity, RoadmapData } from "./roadmap.entity";

// DTO for creating a roadmap
export class CreateRoadmapDto {
  @IsString()
  @IsNotEmpty({ message: "Title is required" })
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";

  @IsOptional()
  @IsObject()
  data?: RoadmapData;
}

// DTO for updating a roadmap
export class UpdateRoadmapDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";

  @IsOptional()
  @IsObject()
  data?: RoadmapData;
}

// DTO for roadmap response
export class RoadmapResponseDto {
  id!: string;
  title!: string;
  description?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  data!: RoadmapData;
  userId!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static fromEntity(entity: RoadmapEntity): RoadmapResponseDto {
    const dto = new RoadmapResponseDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.description = entity.description || undefined;
    dto.status = entity.status || "DRAFT";
    dto.data = entity.data;
    dto.userId = entity.userId;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}

// DTO for roadmap list response (without full data)
export class RoadmapListItemDto {
  id!: string;
  title!: string;
  description?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  userId!: string;
  createdAt!: Date;
  updatedAt!: Date;
  nodeCount!: number;
  edgeCount!: number;

  static fromEntity(entity: RoadmapEntity): RoadmapListItemDto {
    const dto = new RoadmapListItemDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.description = entity.description || undefined;
    dto.status = entity.status || "DRAFT";
    dto.userId = entity.userId;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.nodeCount = entity.data?.nodes?.length || 0;
    dto.edgeCount = entity.data?.edges?.length || 0;
    return dto;
  }
}

