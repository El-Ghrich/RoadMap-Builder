import { Request, Response } from "express";
import { RefreshTokenService } from "./refreshToken.service";

export class RefreshTokenController {
  constructor(private refreshTokenService: RefreshTokenService) {}


  private setCookie(res: Response, token: string) {
    res.cookie("refreshToken", token, {
      httpOnly: true,  
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict", 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      path: "/" 
    });
  }

  async refresh(req: Request, res: Response) {
    const incomingToken = req.cookies.refreshToken;

    if (!incomingToken) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    try {
      
      const { accessToken, refreshToken } = await this.refreshTokenService.rotateRefreshToken(incomingToken);

      res.cookie("refreshToken", refreshToken, {
      httpOnly: true,  
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict", 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      path: "/" 
      });


      res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
      path: "/"
      });
      

    } catch (error) {
      
      res.clearCookie("refreshToken");
      return res.status(403).json({ 
        message: "Session invalide ou expirée", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  }
}