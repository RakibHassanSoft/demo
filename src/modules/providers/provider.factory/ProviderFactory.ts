import { ApiProvider } from "./ApiProvider";
import { OAuthProvider } from "./OAuthProvider";

export  type AuthType = "api_key" | "oauth2";

export class ProviderFactory {
  static create(authType: AuthType, config: any) {
    switch (authType) {
      case "api_key":
        return new ApiProvider(config);

      case "oauth2":
        return new OAuthProvider(config);

      default:
        throw new Error("Unsupported auth type");
    }
  }
}