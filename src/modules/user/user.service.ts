import { UserRepository } from "./user.repository";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { addDays } from "../../utils/time";

export class UserService {
  private repo = new UserRepository();

  async oauthLogin(data: any) {

        console.log("LOGIN DATA:", data);
    if (!data?.email) {
      throw new Error("Email required");
    }

    let user = await this.repo.findByEmail(data.email);

    if (!user) {
      user = await this.repo.createUser({
        email: data.email,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        avatarUrl: data.avatarUrl || "",
      });
    }

    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
    });

    const refreshToken = signRefreshToken({
      id: user.id,
    });

    // 🔥 SAAS FIX: remove old tokens
    await this.repo.deleteRefreshTokensByUser(user.id);

    await this.repo.createRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt: addDays(30),
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refresh(oldToken: string) {
    if (!oldToken) {
      throw new Error("Refresh token missing");
    }

    let decoded: any;

    try {
      decoded = verifyRefreshToken(oldToken);
    } catch {
      throw new Error("Invalid refresh token");
    }

    const stored = await this.repo.findRefreshToken(oldToken);

    if (!stored) {
      throw new Error("Refresh token not found");
    }

    const newAccessToken = signAccessToken({
      id: decoded.id,
    });

    const newRefreshToken = signRefreshToken({
      id: decoded.id,
    });

    await this.repo.deleteRefreshToken(oldToken);

    await this.repo.createRefreshToken({
      userId: decoded.id,
      token: newRefreshToken,
      expiresAt: addDays(30),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async getProfile(userId: string) {
    if (!userId) throw new Error("User ID required");
    return this.repo.findById(userId);
  }

  async logout(token: string) {
    if (!token) return;
    return this.repo.deleteRefreshToken(token);
  }
}