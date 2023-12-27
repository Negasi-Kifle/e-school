import { Router } from "express";
const router = Router();
import protect from "../../utils/protect";
import auth from "../../utils/auth";
import validate from "../../utils/validator";
import {
  validateCreateAPI,
  validateDeleteAll,
  validateUpdateAPI,
} from "./validation";
import {
  createPCO,
  deleteAllInDB,
  deleteById,
  deleteTenantPCOs,
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
  )
  .delete(
    protect,
    auth("Super-admin", "Owner"),
    validate(validateDeleteAll),
    deleteTenantPCOs
  );

router
  .route("/")
  .get(protect, auth("Super-admin"), getAllInDB)
  .delete(
    protect,
    auth("Super-admin"),
    validate(validateDeleteAll),
    deleteAllInDB
  );

router
  .route("/tenant/:tenantId/pco/:pcoId")
  .get(protect, auth("Super-admin"), getById)
  .patch(
    protect,
    auth("Owner", "Director"),
    validate(validateUpdateAPI),
    updatePCO
  )
  .delete(protect, auth("Owner", "Director"), deleteById);

// Export
export default router;
