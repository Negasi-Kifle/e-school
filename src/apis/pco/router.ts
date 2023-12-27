import { Router } from "express";
const router = Router();
import protect from "../../utils/protect";
import auth from "../../utils/auth";
import validate from "../../utils/validator";
import { validateCreateAPI } from "./validation";
import { createPCO, getAllInDB, getAllInTenant } from "./controller";

// Mount routes with their respective controller methods
router
  .route("/:tenantId")
  .post(
    protect,
    auth("Owner", "Director"),
    validate(validateCreateAPI),
    createPCO
  )
  .get(
    protect,
    auth("Super-admin", "Owner", "Director", "Teacher"),
    getAllInTenant
  );

router.route("/").get(protect, auth("Super-admin"), getAllInDB);

// Export
export default router;
