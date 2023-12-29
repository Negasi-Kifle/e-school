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
  validatePswdResetAPI,
  validateUpdateProfileAPI,
} from "./validation";
import {
  changePswd,
  createOwner,
  createUser,
  deleteAllOwners,
  deleteAllUsers,
  deleteUserById,
  deleteOwnerById,
  deleteTenantUsers,
  getAllOwners,
  getAllUsers,
  getOwnerById,
  getProfileData,
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
  .get(protect, auth("Super-admin"), getOwnerById)
  .delete(protect, auth("Super-admin"), deleteOwnerById);

router.patch(
  "/owners/resetpswd",
  protect,
  auth("Super-admin"),
  validate(validatePswdResetAPI),
  resetOwnerPasssword
);

router.post("/login", validate(validateLogin), login);

router
  .route("/profile")
  .patch(
    protect,
    auth("Owner", "Director", "Teacher", "Assistant"),
    validate(validateUpdateProfileAPI),
    updateProfile
  )
  .get(
    protect,
    auth("Owner", "Director", "Teacher", "Assistant"),
    getProfileData
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
  .get(protect, auth("Owner", "Director", "Super-admin", "Admin"), getUserById)
  .delete(protect, auth("Owner", "Director"), deleteUserById);

router.patch(
  "/resetpswd/tenant/:tenantId",
  protect,
  auth("Owner", "Director"),
  validate(validatePswdResetAPI),
  resetUserPassword
);

// Export router
export default router;
