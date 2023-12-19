import { Router } from "express";
const router = Router();
import protect from "../../utils/protect";
import auth from "../../utils/auth";
import validate from "../../utils/validator";
import { validateCreateAPI } from "./validation";
import {
  createStudent,
  getAllStudentsInDB,
  getStudentInTenant,
  getStudentsInTenant,
} from "./controller";

// Mount routes with their respective controller methods
router
  .route("/:tenantId")
  .post(
    protect,
    auth("Owner", "Director", "Teacher"),
    validate(validateCreateAPI),
    createStudent
  )
  .get(
    protect,
    auth("Super-admin", "Owner", "Director", "Teacher"),
    getStudentsInTenant
  );

router.route("/").get(protect, auth("Super-admin"), getAllStudentsInDB);

router
  .route("/tenant/:tenantId/student/:studId")
  .get(
    protect,
    auth("Super-admin", "Owner", "Director", "Teacher"),
    getStudentInTenant
  );

// Export
export default router;
