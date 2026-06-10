import { ProviderList } from "./provider.types";

export interface ProviderConfig {
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  baseUrl?: string;
}

export abstract class BaseProvider {
  protected config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  abstract testConnection(): Promise<boolean>;

  abstract connect(): Promise<any>;

  abstract getLists(): Promise<ProviderList[]>;

  // abstract discoverCapabilities?(): Promise<any>;
}