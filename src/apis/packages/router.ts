import { Router } from "express";
const router = Router();
import protect from "../../utils/protect";
import auth from "../../utils/auth";
import validate from "../../utils/validator";
import { validateCreateAPI } from "./validation";
import {
  createPack,
  getAllPackagesInDB,
  getTenantPackages,
} from "./controller";

// Mounte routes with their respective controller methods
router
  .route("/:tenantId")
  .post(
    protect,
    auth("Owner", "Director"),
    validate(validateCreateAPI),
    createPack
  )
  .get(
    protect,
    auth("Super-admin", "Admin", "Owner", "Director"),
    getTenantPackages
  );

router.get("/", protect, auth("Super-admin"), getAllPackagesInDB);

// Export router
export default router;