import AppError from "../../utils/app_error";
import Parent from "../parents/dal";
import School from "../schools/dal";
import IUsersDoc from "../users/dto";
import Student from "./dal";
import { RequestHandler } from "express";
import checkOwnership from "./utils/check_ownership";

// Create student
export const createStudent: RequestHandler = async (req, res, next) => {
  try {
    // Incoming data
    const data = <StudentRequests.ICreateStudent>req.value;

    // Check user is in the same tenant
    const loggedInUser = <IUsersDoc>req.user;
    if (
      loggedInUser.role !== "Owner" &&
      loggedInUser.tenant_id !== req.params.tenantId
    ) {
      return next(new AppError("You don't belong to this school", 400));
    }

    // Check parent exists
    const parent = await Parent.getParent(data.parent);
    if (!parent) return next(new AppError("Unknown parent selected", 404));

    // Check school exists
    const school = await School.getSchool(data.tenant_id);
    if (!school) return next(new AppError("School is required", 404));

    // If user role is "Owner", check he/she owns the school
    if (
      loggedInUser.role === "Owner" &&
      school.owner.toString() !== loggedInUser.id
    ) {
      return next(new AppError("You don't own this school", 400));
    }

    // Create student
    const student = await Student.createStudent(data);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "New student created successfully",
      data: { student },
    });
  } catch (error) {
    next(error);
  }
};

// Get all students in tenant
export const getStudentsInTenant: RequestHandler = async (req, res, next) => {
  try {
    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School does not exist", 404));

    // Check logged in user blongs/owns the school
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    // Get all students in tenant
    const students = await Student.getStudentsInTenant(
      req.params.tenantId,
      req.query
    );

    // Response
    res.status(200).json({
      status: "SUCCESS",
      results: students.length,
      data: { students },
    });
  } catch (error) {
    next(error);
  }
};

// Get all students in DB
export const getAllStudentsInDB: RequestHandler = async (req, res, next) => {
  try {
    const students = await Student.getAllStudentsInDB(req.query);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      results: students.length,
      data: { students },
    });
  } catch (error) {
    next(error);
  }
};
