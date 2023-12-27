import { RequestHandler } from "express";
import PCO from "./dal";
import School from "../schools/dal";
import AppError from "../../utils/app_error";
import IUsersDoc from "../users/dto";
import checkOwnership from "../students/utils/check_ownership";
import slugifer from "../../utils/slugfier";

// Create PCO
export const createPCO: RequestHandler = async (req, res, next) => {
  try {
    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School does not exist", 404));

    // Check the logged in user has the previlege to do the operation
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    // Incoming data
    const data = <PCORequests.ICreatePCO>req.value;
    data.pmt_title_slug = slugifer(data.pmt_title.toLowerCase()); // Slugify the title

    // Create PCO
    const pco = await PCO.createPCO(data);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "New payment collection order created successfully",
      data: { pco },
    });
  } catch (error) {
    next(error);
  }
};

// Get all PCOs in tenant
export const getAllInTenant: RequestHandler = async (req, res, next) => {
  try {
    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School does not exist", 404));

    // Check the logged in user has the previlege for this operation
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    // Get all PCOs in a tenant
    const tenantPCOs = await PCO.getAllInTenant(req.params.tenantId, req.query);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      results: tenantPCOs.length,
      data: { tenantPCOs },
    });
  } catch (error) {
    next(error);
  }
};

// Get all PCOs in DB
export const getAllInDB: RequestHandler = async (req, res, next) => {
  try {
    // Get PCOs in DB
    const allPCOsInDB = await PCO.getAllInDB(req.query);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      results: allPCOsInDB.length,
      data: { allPCOsInDB },
    });
  } catch (error) {
    next(error);
  }
};
