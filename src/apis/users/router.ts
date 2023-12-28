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
  getUserById,
  login,
  resetOwnerPasssword,
  resetUserPassword,
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

router.patch(
  "/owners/resetpswd/:ownerId",
  protect,
  auth("Super-admin"),
  resetOwnerPasssword
);

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

router
  .route("/tenant/:tenantId/user/:userId")
  .get(protect, auth("Owner", "Director", "Super-admin", "Admin"), getUserById);

router.patch(
  "/resetpswd/tenant/:tenantId/user/:userId",
  protect,
  auth("Owner", "Director"),
  resetUserPassword
);

// Export router
export default router;
