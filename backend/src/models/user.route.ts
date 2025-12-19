import { Request, Router ,Response, RequestParamHandler } from "express";

import { userController } from "./user.registry";
import {checkAuth} from "../middlewares/checkAuth";

export const userRouter = Router();


userRouter.post('/signup',  userController.signUp );
userRouter.post('/login', userController.login);
userRouter.use(checkAuth)

userRouter.get("/logout" , userController.logout);