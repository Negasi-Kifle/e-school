import express, { Request, Response, NextFunction } from "express";
const app = express();

// Custom and third party middlewares
import geh from "../utils/geh";
import cors from "cors";
import checkAPIKey from "../utils/check_api_key";
import AppError from "../utils/app_error";
import adminRouter from "../apis/admin/router";

// Parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));

// Check api key
app.use("*", checkAPIKey);

// Check server is up
app.use("/api/v1/test", (req, res) => {
  res.send("Everything going well...");
});

// Mount endpoints with their respective router file
app.use("/api/v1/admins", adminRouter);

// Handle unknown url
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new AppError("Unknown URL", 404));
});

// Use the global error handler
app.use(geh);

// Export
export default app;
