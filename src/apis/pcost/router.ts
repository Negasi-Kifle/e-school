import { Router } from "express";

const router = Router();

import {
  createPCOST,
  deleteAllPCOSTs,
  deletePCOST,
  getPCOSTById,
  getPCOSTByPCO,
  getPCOSTByPCOSTtudent,
  getPCOSTByParent,
  getPCOSTs,
  getUnpaidFeesOfStudent,
  updatePCOST,
} from "./controller";
import {
  createPCOSTValidation,
  deleteAllPCOSTsValidation,
  updatePCOSTValidation,
} from "./validation";

import validator from "../../utils/validator";
import protect from "../../utils/protect";
import auth from "../../utils/auth";

router
  .route("/")
  .post(
    protect,
    auth("Super-admin", "Admin", "Call-center", "Owner"),
    validator(createPCOSTValidation),
    createPCOST
  )
  .get(protect, auth("Super-admin", "Admin", "Call-center", "Owner"), getPCOSTs)
  .delete(
    protect,
    auth("Super-admin"),
    validator(deleteAllPCOSTsValidation),
    deleteAllPCOSTs
  );

router.get(
  "/unpaidfees/:studId",
  protect,
  auth(
    "Super-admin",
    "Admin",
    "Call-center",
    "Owner",
    "Parent",
    "Director",
    "Registrar"
  ),
  getUnpaidFeesOfStudent
);

router.get(
  "/pco/:id",
  protect,
  auth("Super-admin", "Admin", "Call-center", "Owner", "Parent", "Director"),
  getPCOSTByPCO
);

router.get(
  "/student/:id",
  protect,
  auth(
    "Super-admin",
    "Admin",
    "Call-center",
    "Owner",
    "Parent",
    "Director",
    "Registrar"
  ),
  getPCOSTByPCOSTtudent
);

router.get(
  "/parent/:id",
  protect,
  auth("Super-admin", "Admin", "Call-center", "Owner", "Parent"),
  getPCOSTByParent
);

router
  .route("/:id")
  .get(protect, auth("Super-admin", "Admin", "Call-center"), getPCOSTById)
  .patch(
    protect,
    auth("Super-admin", "Admin", "Call-center", "Owner", "Director"),
    validator(updatePCOSTValidation),
    updatePCOST
  )
  .delete(
    protect,
    auth("Super-admin"),
    validator(deleteAllPCOSTsValidation),
    deletePCOST
  );

export default router;
