import { Router } from "express";
const router = Router();
import protect from "../../utils/protect";
import auth from "../../utils/auth";
import validate from "../../utils/validator";
import { validateCreateAPI } from "./validation";
import { createUser } from "./controller";

// Create user data
router
  .route("/")
  .post(
    protect,
    auth("Owner", "Super-admin"),
    validate(validateCreateAPI),
    createUser
  );

// Export router
export default router;
