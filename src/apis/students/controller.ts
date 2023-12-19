import AppError from "../../utils/app_error";
import Parent from "../parents/dal";
import School from "../schools/dal";
import IUsersDoc from "../users/dto";
import Student from "./dal";
import { RequestHandler } from "express";

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
