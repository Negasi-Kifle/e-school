import express, { Request, Response, NextFunction } from "express";
const app = express();

// Custom and third party middlewares
import geh from "../utils/geh";
import cors from "cors";
import checkAPIKey from "../utils/check_api_key";
import AppError from "../utils/app_error";

// Parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));

// Check api key
app.use("*", checkAPIKey);

// Mount endpoints with their respective router file

// Handle unknown url
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new AppError("Unknown URL", 404));
});

// Use the global error handler
app.use(geh);

// Export
export default app;
