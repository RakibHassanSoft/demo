import { PrismaClient } from "@prisma/client";
import { AuthType, ProviderFactory } from "./provider.factory/ProviderFactory";

const prisma = new PrismaClient();

export class ProviderService {
  // CREATE CONNECTION
  static async createConnection(userId: string, data: any) {
    const provider = await prisma.provider.findUnique({
      where: { id: data.providerId },
    });

    if (!provider) throw new Error("Provider not found");

    // store ONLY what is needed based on auth type
    const connection = await prisma.providerConnection.create({
      data: {
        userId,
        providerId: data.providerId,

        name: data.name || provider.name,
        status: "pending",

        // OAuth
        accessToken: data.accessToken || null,
        refreshToken: data.refreshToken || null,

        // API KEY
        apiKey: data.apiKey || null,
        apiSecret: data.apiSecret || null,

        metadata: data.metadata || {},
      },
      include: {
        provider: true,
      },
    });

    return connection;
  }

  // TEST CONNECTION (SAFE)
  static async testConnection(connectionId: string) {
    const connection = await prisma.providerConnection.findUnique({
      where: { id: connectionId },
      include: { provider: true },
    });

    if (!connection) throw new Error("Connection not found");

    const provider = ProviderFactory.create(connection.provider.authType as AuthType, {
      apiKey: connection.apiKey,
      apiSecret: connection.apiSecret,
      accessToken: connection.accessToken,
      refreshToken: connection.refreshToken,
      baseUrl: connection.provider.apiBaseUrl,
    });

    const result = await provider.testConnection();

    return { success: result };
  }

  // CONNECT (FINAL VALIDATION)
  static async connectConnection(connectionId: string) {
    const connection = await prisma.providerConnection.findUnique({
      where: { id: connectionId },
      include: { provider: true },
    });

    if (!connection) throw new Error("Connection not found");

    const provider = ProviderFactory.create(connection.provider.authType as AuthType, {
      apiKey: connection.apiKey,
      apiSecret: connection.apiSecret,
      accessToken: connection.accessToken,
      refreshToken: connection.refreshToken,
      baseUrl: connection.provider.apiBaseUrl,
    });

    const ok = await provider.connect();

    await prisma.providerConnection.update({
      where: { id: connectionId },
      data: {
        status: ok.success ? "active" : "failed",
      },
    });

    if (!ok.success) {
      throw new Error("Connection failed");
    }

    return ok;
  }

  // USER CONNECTIONS
  static async getUserConnections(userId: string) {
    return prisma.providerConnection.findMany({
      where: { userId },
      include: { provider: true },
    });
  }

  // GET LISTS (IMPORTANT FOR PHASE 1)
  static async getLists(connectionId: string) {
    const connection = await prisma.providerConnection.findUnique({
      where: { id: connectionId },
      include: { provider: true },
    });

    if (!connection) throw new Error("Not found");

    const provider = ProviderFactory.create(connection.provider.authType as AuthType, {
      apiKey: connection.apiKey,
      accessToken: connection.accessToken,
      baseUrl: connection.provider.apiBaseUrl,
    });

    return provider.getLists();
  }
}