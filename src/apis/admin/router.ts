import { Router } from "express";

const router = Router();

import {
  createAdminFirstAccount,
  adminLogin,
  getAdmin,
  updateDefaultPassword,
  createAdmin,
  updateAdminProfile,
  updateEmailOrPhoneNumber,
  updateAdminRole,
  updateAdminPassword,
  resetAdminPassword,
  updateAdminAccountStatus,
  deleteAdmin,
  deleteAllAdmins,
  getAllAdmins,
} from "./controller";
import {
  createFirstAdminValidation,
  adminLoginValidation,
  updateDefaultPasswordValidation,
  createAdminValidation,
  updateEmailOrPhoneNumberValidation,
  updateAdminRoleValidation,
  updateAdminPasswordValidation,
  resetAdminPasswordValidation,
  updateAdminAccountStatusValidation,
  deleteAllAdminsValidation,
} from "./validation";

import validator from "../../utils/validator";

router.post("/login", validator(adminLoginValidation), adminLogin);
router.patch(
  "/defaultpassword",
  validator(updateDefaultPasswordValidation),
  updateDefaultPassword
);

router
  .route("/firstaccount")
  .post(validator(createFirstAdminValidation), createAdminFirstAccount);

router.patch(
  "/profile",

  updateAdminProfile
);

router.patch(
  "/emailorphonenumber",
  validator(updateEmailOrPhoneNumberValidation),
  updateEmailOrPhoneNumber
);

router.patch(
  "/password",
  validator(updateAdminPasswordValidation),
  updateAdminPassword
);

router.patch(
  "/resetpassword",
  validator(resetAdminPasswordValidation),
  resetAdminPassword
);

router.patch("/role", validator(updateAdminRoleValidation), updateAdminRole);

router.patch(
  "/accountstatus",
  validator(updateAdminAccountStatusValidation),
  updateAdminAccountStatus
);

router
  .route("/")
  .post(validator(createAdminValidation), createAdmin)
  .get(getAllAdmins)
  .delete(validator(deleteAllAdminsValidation), deleteAllAdmins);

router.route("/:id").get(getAdmin).delete(deleteAdmin);

export default router;
