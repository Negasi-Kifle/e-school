import { Router } from "express";
const router = Router();
import protect from "../../utils/protect";
import auth from "../../utils/auth";
import validate from "../../utils/validator";
import { validateCreateAPI } from "./validation";
import {
  createStudent,
  getAllStudentsInDB,
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
  .get(protect, auth("Owner", "Director", "Teacher"), getStudentsInTenant);

router.route("/").get(protect, auth("Super-admin"), getAllStudentsInDB);

// Export
export default router;
