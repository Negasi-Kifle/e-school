import { Router } from "express";

const router = Router();

import {
  parentLogin,
  getParent,
  updateDefaultPassword,
  createParent,
  updatePhoneNumber,
  updateParentPassword,
  resetParentPassword,
  updateParentAccountStatus,
  deleteParent,
  deleteAllParents,
  getAllParents,
  getParentChildren,
} from "./controller";
import {
  parentLoginValidation,
  updateDefaultPasswordValidation,
  createParentValidation,
  updatePhoneNumberValidation,
  resetParentPasswordValidation,
  updateParentAccountStatusValidation,
  deleteAllParentsValidation,
  updatePasswordValidation,
} from "./validation";

import validator from "../../utils/validator";

import protect from "../../utils/protect";
import bypass from "../../utils/bypass";
import auth from "../../utils/auth";
import { upload } from "../../utils/file_upload";

router.post("/login", validator(parentLoginValidation), parentLogin);
router.patch(
  "/defaultpassword",
  protect,
  validator(updateDefaultPasswordValidation),
  updateDefaultPassword
);

router.patch(
  "/phonenumber",
  protect,
  auth("Parent"),
  validator(updatePhoneNumberValidation),
  updatePhoneNumber
);

router.patch(
  "/password",
  protect,
  auth("Parent"),
  validator(updatePasswordValidation),
  updateParentPassword
);

router.patch(
  "/resetpassword",
  protect,
  auth("Super-admin"),
  validator(resetParentPasswordValidation),
  resetParentPassword
);

router.patch(
  "/accountstatus",
  protect,
  auth("Super-admin"),
  validator(updateParentAccountStatusValidation),
  updateParentAccountStatus
);

router
  .route("/")
  .post(
    protect,
    auth("Super-admin"),
    upload.single("picture"),
    validator(createParentValidation),
    createParent
  )
  .get(
    protect,
    auth("Super-admin", "Owner", "Teacher", "Director", "Admin"),
    getAllParents
  )
  .delete(
    protect,
    auth("Super-admin"),
    validator(deleteAllParentsValidation),
    deleteAllParents
  );

router
  .route("/:id")
  .get(protect, auth("Super-admin", "Parent", "Call-center"), getParent)
  .delete(protect, auth("Super-admin"), deleteParent);

router.get(
  "/children/:parentId",
  protect,
  auth("Super-admin", "Parent", "Call-center", "Owner", "Teacher", "Director"),
  getParentChildren
);

export default router;
