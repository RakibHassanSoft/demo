import axios from "axios";
import { BaseProvider } from "./BaseProvider";
type ConnectResult = {
  success: boolean;
  message?: string;
};

export type ProviderList = {
  id: string;
  name: string;
  count?: number;
};
export class ApiProvider extends BaseProvider {
  async testConnection(): Promise<boolean> {
    try {
      const res = await axios.get(`${this.config.baseUrl}/ping`, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      });

      return res.status === 200;
    } catch (err) {
      return false;
    }
  }

  async connect(): Promise<ConnectResult> {
    const test = await this.testConnection();

    if (!test) {
      throw new Error("Provider connection failed");
    }

    return {
      success: true,
      message: "Connected successfully",
    };
  }

  async getLists(): Promise<ProviderList[]> {
    const res = await axios.get(`${this.config.baseUrl}/lists`, {
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
      },
    });

    return res.data;
  }
}