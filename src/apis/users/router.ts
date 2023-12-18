import { Router } from "express";
const router = Router();
import protect from "../../utils/protect";
import auth from "../../utils/auth";
import validate from "../../utils/validator";
import {
  validateChangePswdAPI,
  validateCreateUserAPI,
  validateDeleteAll,
  validateLogin,
  validateUpdateProfileAPI,
} from "./validation";
import {
  changePswd,
  createOwner,
  createUser,
  deleteAllOwners,
  deleteAllUsers,
  deleteOwnerById,
  deleteTenantUsers,
  getAllOwners,
  getAllUsers,
  getOwnerById,
  getTenantUsers,
  login,
  updateProfile,
} from "./controller";

// Mount routes with their respective controller methods
router
  .route("/")
  .get(protect, auth("Super-admin"), getAllUsers)
  .delete(
    protect,
    auth("Super-admin"),
    validate(validateDeleteAll),
    deleteAllUsers
  );

router
  .route("/owners")
  .post(
    protect,
    auth("Owner", "Super-admin"),
    validate(validateCreateUserAPI),
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

router.post("/login", validate(validateLogin), login);

router.patch(
  "/profile",
  protect,
  validate(validateUpdateProfileAPI),
  updateProfile
);

router.patch(
  "/changepswd",
  protect,
  validate(validateChangePswdAPI),
  changePswd
);

router
  .route("/tenant/:tenantId")
  .post(
    protect,
    auth("Super-admin", "Owner"),
    validate(validateCreateUserAPI),
    createUser
  )
  .delete(
    protect,
    auth("Owner"),
    validate(validateDeleteAll),
    deleteTenantUsers
  )
  .get(protect, auth("Super-admin", "Owner"), getTenantUsers);

// Export router
export default router;
