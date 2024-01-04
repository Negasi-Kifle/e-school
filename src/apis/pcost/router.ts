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
    auth("Super-admin", "Admin", "Call-center"),
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
  "/pco/:id",
  protect,
  auth("Super-admin", "Admin", "Call-center", "Owner"),
  getPCOSTByPCO
);

router.get(
  "/student/:id",
  protect,
  auth("Super-admin", "Admin", "Call-center", "Owner"),
  getPCOSTByPCOSTtudent
);

router.get(
  "/parent/:id",
  protect,
  auth("Super-admin", "Admin", "Call-center", "Owner"),
  getPCOSTByParent
);

router
  .route("/:id")
  .get(protect, auth("Super-admin", "Admin", "Call-center"), getPCOSTById)
  .patch(
    protect,
    auth("Super-admin", "Admin", "Call-center"),
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
