import { Request, Response } from "express";
import { ProviderService } from "./ProviderService";

export class ProviderController {
  // POST /provider/connect
  static async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      const connection = await ProviderService.createConnection(
        userId as string,
        req.body
      );

      res.json(connection);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // POST /provider/:id/test
  static async test(req: Request, res: Response) {
    try {
      const connectionId = req.params.id;

      const result = await ProviderService.connectConnection(connectionId as string);

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // POST /provider/:id/connect
  static async connect(req: Request, res: Response) {
    try {
      const result = await ProviderService.connectConnection(req.params.id as string);

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // GET /providers
  static async getAll(req: Request, res: Response) {
    const userId = req.user?.id;

    const data = await ProviderService.getUserConnections(userId as string);

    res.json(data);
  }

  // GET /provider/:id/lists
  static async lists(req: Request, res: Response) {
    const data = await ProviderService.getLists(req.params.id as string);

    res.json(data);
  }
}