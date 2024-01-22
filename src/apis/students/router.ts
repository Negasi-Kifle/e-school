import { Router } from "express";
const router = Router();
import protect from "../../utils/protect";
import auth from "../../utils/auth";
import validate from "../../utils/validator";
import {
  validateCreateAPI,
  validateDeleteAllAPI,
  validateUpdateAPI,
} from "./validation";
import {
  createStudent,
  deleteAllStudentsInTenant,
  deleteStudInTenant,
  getAllStudentsInDB,
  getStudentInTenant,
  getStudentsInTenant,
  updateStudent,
} from "./controller";

// Mount routes with their respective controller methods
router
  .route("/:tenantId")
  .post(
    protect,
    auth("Owner", "Director", "Teacher", "Registral"),
    validate(validateCreateAPI),
    createStudent
  )
  .get(
    protect,
    auth("Super-admin", "Owner", "Director", "Teacher", "Registral"),
    getStudentsInTenant
  )
  .delete(
    protect,
    auth("Super-admin"),
    validate(validateDeleteAllAPI),
    deleteAllStudentsInTenant
  );

router.route("/").get(protect, auth("Super-admin"), getAllStudentsInDB);

router
  .route("/tenant/:tenantId/student/:studId")
  .get(
    protect,
    auth("Super-admin", "Owner", "Director", "Teacher", "Registral"),
    getStudentInTenant
  )
  .patch(
    protect,
    auth("Owner", "Director", "Teacher", "Registral"),
    validate(validateUpdateAPI),
    updateStudent
  )
  .delete(
    protect,
    auth("Owner", "Director", "Teacher", "Registral"),
    validate(validateDeleteAllAPI),
    deleteStudInTenant
  );

// Export
export default router;
