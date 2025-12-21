import { UserService } from "./user.service";
import { Request, Response } from "express";
import { ApiResponse } from "../../utils/api/api.response";
import { ValidationError } from "class-validator";
export class UserController {


    constructor(private userService: UserService) { }

    async signUp(req: Request, res: Response): Promise<Response> {
        try {

            const user = await this.userService.signUp(req.body);


            return res.status(201).json(
                ApiResponse.success(user, "User created successfully")
            );

        } catch (err: any) {

            if (Array.isArray(err) && err[0] instanceof ValidationError) {
                const validationErrors = err.map(e => Object.values(e.constraints || {})).flat();
                return res.status(400).json(
                    ApiResponse.error("Validation failed", validationErrors)
                );
            }


            const statusCode = err.message.includes('exist') ? 409 : 500;
            return res.status(statusCode).json(
                ApiResponse.error(err.message || "Internal server error")
            );
        }
    }

    async login(req: Request, res: Response) {


        try {

            const { user, accessToken, refreshToken } = await this.userService.login(req.body);

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 15 * 60 * 1000
            });

            if (refreshToken != null) {
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
            }

            return res.status(200).json(
                ApiResponse.success(user, "Login successful")
            );

        } catch (err: any) {

            if (Array.isArray(err) && err.length > 0 && err[0] instanceof ValidationError) {
                return res.status(400).json(ApiResponse.error("Validation failed", err));
            }

            return res.status(401).json(
                ApiResponse.error(err.message || "Authentication failed")
            );
        }
    }

    async getProfil(req: Request, res: Response): Promise<Response> {

        try {

            const id = req.userId;
            
            if (!id) {
                return res.status(401).json(ApiResponse.error("User ID missing from request"));
            }

            const profil = await this.userService.getProfil(id as string);

            return res.status(200).json(
                ApiResponse.success(profil, "User Profil")
            );

        } catch (err: any) {
            return res.status(err.message === "User not found" ? 404 : 500).json(
                ApiResponse.error(err.message || "Internal server error")
            );
        }
    }


}