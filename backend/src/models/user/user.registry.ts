import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { RefreshTokenRegistry } from "../refreshToken/refreshToken.registry";


const repository = new UserRepository();
export const userService = new UserService(repository,RefreshTokenRegistry.service);
export const userController = new UserController(userService);

