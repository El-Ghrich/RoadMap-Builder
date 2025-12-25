import { RoadmapRepository } from "./roadmap.repository";
import { RoadmapService } from "./roadmap.service";
import { RoadmapController } from "./roadmap.controller";

const repository = new RoadmapRepository();
export const roadmapService = new RoadmapService(repository);
export const roadmapController = new RoadmapController(roadmapService);

