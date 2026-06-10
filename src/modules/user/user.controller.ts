import { Request, Response } from "express";
import { UserService } from "./user.service";

const service = new UserService();

export class UserController {
async oauthLogin(req: Request, res: Response) {
  try {
    const result = await service.oauthLogin(req.body);

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      user: result.user,
    });
  } catch (err: any) {
    console.error("OAUTH LOGIN ERROR:");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token" });
      }

      const result = await service.refresh(refreshToken);

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      });

      return res.status(200).json({ success: true });
    } catch (err: any) {
      return res.status(401).json({ message: err.message });
    }
  }

  async profile(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const profile = await service.getProfile(user.id);

      return res.status(200).json(profile);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (refreshToken) {
        await service.logout(refreshToken);
      }

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      return res.status(200).json({ message: "Logged out" });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
}