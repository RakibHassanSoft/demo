// routes/providerRoutes.ts

import express from "express";
import { ProviderController } from "./providerController";

const router = express.Router();

router.post("/connect", (req, res) =>
  ProviderController.create(req, res)
);

router.post("/:id/test", (req, res) =>
  ProviderController.test(req, res)
);

router.post("/:id/connect", (req, res) =>
  ProviderController.connect(req, res)
);

router.get("/", (req, res) =>
  ProviderController.getAll(req, res)
);

router.get("/:id/lists", (req, res) =>
  ProviderController.lists(req, res)
);

export default router;