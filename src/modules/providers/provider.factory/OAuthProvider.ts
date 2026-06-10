import axios from "axios";
import { BaseProvider } from "./BaseProvider";
export type ProviderList = {
  id: string;
  name: string;
  count?: number;
};

type ConnectResult = {
  success: boolean;
  message?: string;
};

export class OAuthProvider extends BaseProvider {
  async testConnection(): Promise<boolean> {
    try {
      if (!this.config.accessToken) return false;

      // generic OAuth test (placeholder)
      const res = await axios.get(`${this.config.baseUrl}`, {
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
        },
      });

      return res.status === 200;
    } catch (err) {
  console.error("OAuthProvider error:", err);
  return false;
}
  }

  async connect(): Promise<ConnectResult> {
    const ok = await this.testConnection();

    if (!ok) {
      throw new Error("OAuth connection failed");
    }

    return {
      success: true,
      message: "OAuth connected successfully",
    };
  }

  async getLists(): Promise<ProviderList[]> {
    const res = await axios.get(`${this.config.baseUrl}/lists`, {
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
      },
    });

    return res.data;
  }
}
