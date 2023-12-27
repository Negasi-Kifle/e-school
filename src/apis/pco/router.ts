import { Router } from "express";
const router = Router();
import protect from "../../utils/protect";
import auth from "../../utils/auth";
import validate from "../../utils/validator";
import { validateCreateAPI } from "./validation";
import { createPCO } from "./controller";

// Mount routes with their respective controller methods
router
  .route("/:tenantId")
  .post(
    protect,
    auth("Owner", "Director"),
    validate(validateCreateAPI),
    createPCO
  );

// Export
export default router;
