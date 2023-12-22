import { Router } from "express";
const router = Router();
import protect from "../../utils/protect";
import auth from "../../utils/auth";
import validate from "../../utils/validator";
import {
  validateCreateAPI,
  validateDeleteAllAPI,
  validateUpdateAPI,
} from "./validation";
import {
  createPack,
  deleteById,
  deletePackagesInDB,
  deleteTenantPackages,
  getAllPackagesInDB,
  getPackageById,
  getTenantPackages,
  updatePackage,
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
  )
  .delete(
    protect,
    auth("Owner"),
    validate(validateDeleteAllAPI),
    deleteTenantPackages
  );

router
  .route("/")
  .get(protect, auth("Super-admin"), getAllPackagesInDB)
  .delete(
    protect,
    auth("Super-admin"),
    validate(validateDeleteAllAPI),
    deletePackagesInDB
  );

router
  .route("/tenant/:tenantId/package/:packId")
  .get(
    protect,
    auth("Super-admin", "Admin", "Owner", "Director", "Teacher"),
    getPackageById
  )
  .patch(
    protect,
    auth("Owner", "Director"),
    validate(validateUpdateAPI),
    updatePackage
  )
  .delete(protect, auth("Super-admin", "Owner", "Director"), deleteById);

// Export router
export default router;
