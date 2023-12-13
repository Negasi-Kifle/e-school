import { Router } from "express";

const router = Router();

import {
  createSchool,
  deleteAllSchools
} from "./controller";
import {
  createSchoolValidation,
  deleteAllSchoolsValidation,
} from "./validation";

import validator from "../../utils/validator";


router
  .route("/")
  .post(validator(createSchoolValidation), createSchool)
  .delete(validator(deleteAllSchoolsValidation), deleteAllSchools);



export default router;
