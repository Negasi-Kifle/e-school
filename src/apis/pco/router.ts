import { Router } from "express";
const router = Router();
import protect from "../../utils/protect";
import auth from "../../utils/auth";
import validate from "../../utils/validator";
import { validateCreateAPI, validateUpdateAPI } from "./validation";
import {
  createPCO,
  getAllInDB,
  getAllInTenant,
  getById,
  updatePCO,
} from "./controller";

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

router
  .route("/tenant/:tenantId/pco/:pcoId")
  .get(protect, auth("Super-admin"), getById)
  .patch(
    protect,
    auth("Owner", "Director"),
    validate(validateUpdateAPI),
    updatePCO
  );

// Export
export default router;
