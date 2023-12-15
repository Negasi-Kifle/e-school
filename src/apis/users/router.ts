import { Router } from "express";
const router = Router();
import protect from "../../utils/protect";
import auth from "../../utils/auth";
import validate from "../../utils/validator";
import { validateCreateOwnerAPI, validateDeleteAll } from "./validation";
import {
  createOwner,
  deleteAllOwners,
  deleteOwnerById,
  getAllOwners,
  getAllUsers,
  getOwnerById,
} from "./controller";

// Mount routes with their respective controller methods
router
  .route("/owners")
  .post(
    protect,
    auth("Owner", "Super-admin"),
    validate(validateCreateOwnerAPI),
    createOwner
  )
  .get(protect, auth("Owner", "Super-admin"), getAllOwners)
  .delete(
    protect,
    auth("Super-admin"),
    validate(validateDeleteAll),
    deleteAllOwners
  );

router
  .route("/owners/:id")
  .get(protect, auth("Owner", "Super-admin"), getOwnerById)
  .delete(protect, auth("Super-admin"), deleteOwnerById);

router.route("/").get(protect, auth("Super-admin"), getAllUsers);

// Export router
export default router;
