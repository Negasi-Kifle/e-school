import { Router } from "express";

const router = Router();

import {
  createSchool,
  deleteAllSchools,
  deleteSchool,
  getSchoolById,
  getSchoolsByOwner,
  getSchools,
  updateSchool,
  updateSchoolStatus,
} from "./controller";
import {
  changeSchoolStatus,
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
    auth("Super-admin", "Admin", "Call-center"),
    validator(createSchoolValidation),
    createSchool
  )
  .get(protect, auth("Super-admin", "Admin", "Call-center"), getSchools)
  .delete(
    protect,
    auth("Super-admin"),
    validator(deleteAllSchoolsValidation),
    deleteAllSchools
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
