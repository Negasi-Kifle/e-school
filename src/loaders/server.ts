import express, { Request, Response, NextFunction } from "express";
const app = express();

// Custom and third party middlewares
import geh from "../utils/geh";
import cors from "cors";
import checkAPIKey from "../utils/check_api_key";
import AppError from "../utils/app_error";

import adminRouter from "../apis/admin/router";
import userRouter from "../apis/users/router";
import schoolsRouter from "../apis/schools/router";
import parentsRouter from "../apis/parents/router";
import studentRouter from "../apis/students/router";
import pmtPackageRouter from "../apis/packages/router";
import pcostRouter from "../apis/pcost/router";
import pcoRouter from "../apis/pco/router";

// Parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*", credentials: false }));

// Check api key
app.use("*", checkAPIKey);

// Check server is up
app.use("/api/v1/test", (req, res) => {
  res.send("Everything going well...");
});

// Mount endpoints with their respective router file
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/schools", schoolsRouter);
app.use("/api/v1/parent", parentsRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/pmtpackages", pmtPackageRouter);
app.use("/api/v1/pcost", pcostRouter);
app.use("/api/v1/pco", pcoRouter);

// Handle unknown url
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new AppError("Unknown URL", 404));
});

// Use the global error handler
app.use(geh);

// Export
export default app;
