import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const controller = new UserController();

router.post("/oauth-login", controller.oauthLogin);
router.post("/refresh", controller.refresh);
router.post("/logout", controller.logout);

router.get("/profile", authMiddleware, controller.profile);

export default router;