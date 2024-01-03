import { Router } from "express";

const router = Router();

import {
  createSchoolByAdmin,
  deleteAllSchools,
  deleteSchool,
  getSchoolById,
  getSchoolsByOwner,
  getSchools,
  updateSchool,
  updateSchoolStatus,
  createSchoolByOwner,
} from "./controller";
import {
  changeSchoolStatus,
  createSchoolByOwnerValidation,
  createSchoolValidation,
  deleteAllSchoolsValidation,
  updateSchoolValidation,
} from "./validation";

import validator from "../../utils/validator";
import protect from "../../utils/protect";
import auth from "../../utils/auth";

router
  .route("/")
  .post(
    protect,
    auth("Super-admin", "Admin", "Call-center", "Owner"),
    validator(createSchoolValidation),
    createSchoolByAdmin
  )
  .get(protect, auth("Super-admin", "Admin", "Call-center"), getSchools)
  .delete(
    protect,
    auth("Super-admin"),
    validator(deleteAllSchoolsValidation),
    deleteAllSchools
  );

router
  .route("/owner")
  .post(
    protect,
    auth("Owner"),
    validator(createSchoolByOwnerValidation),
    createSchoolByOwner
  );

router.patch(
  "/status/:id",
  protect,
  auth("Super-admin", "Admin", "Call-center"),
  validator(changeSchoolStatus),
  updateSchoolStatus
);

router.get(
  "/owner/:ownerId",
  protect,
  auth("Super-admin", "Admin", "Call-center", "Owner"),
  getSchoolsByOwner
);

router
  .route("/:id")
  .get(protect, auth("Super-admin", "Admin", "Call-center"), getSchoolById)
  .patch(
    protect,
    auth("Super-admin", "Admin", "Call-center"),
    validator(updateSchoolValidation),
    updateSchool
  )
  .delete(
    protect,
    auth("Super-admin"),
    validator(deleteAllSchoolsValidation),
    deleteSchool
  );

export default router;
