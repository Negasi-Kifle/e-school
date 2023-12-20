import AppError from "../../utils/app_error";
import Parent from "../parents/dal";
import School from "../schools/dal";
import IUsersDoc from "../users/dto";
import Student from "./dal";
import { RequestHandler } from "express";
import checkOwnership from "./utils/check_ownership";
import configs from "../../configs";

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

// Get student in tenant
export const getStudentInTenant: RequestHandler = async (req, res, next) => {
  try {
    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School does not exist", 404));

    // Logged in user
    const loggedInUser = <IUsersDoc>req.user;
    // Check ownership
    checkOwnership(loggedInUser, school);

    // Find student
    const student = await Student.getStudentInTenant(
      req.params.studId,
      school.id
    );
    if (!student) return next(new AppError("Student not found", 404));

    // Response
    res.status(200).json({
      status: "SUCCESS",
      data: { student },
    });
  } catch (error) {
    next(error);
  }
};

// Update student data
export const updateStudent: RequestHandler = async (req, res, next) => {
  try {
    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School doesn't exist", 404));

    // Check the logged in user owns/belongs to the school
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    // Incoming data
    const data = <StudentRequests.IUpdateStudent>req.value;

    // Update student info
    const student = await Student.updateStudent(req.params.studId, data);
    if (!student) return next(new AppError("Student doesn't exist", 404));

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "Student info updated successfully",
      data: { student },
    });
  } catch (error) {
    next(error);
  }
};

// Delete student in a tenant
export const deleteStudInTenant: RequestHandler = async (req, res, next) => {
  try {
    // Check delete key
    const { delete_key } = <StudentRequests.IDeleteKey>req.value;
    if (delete_key !== configs.delete_key)
      return next(new AppError("Please provide a valid delete key", 400));

    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School does not exist", 404));

    // Check the logged in user owns/belongs to the school
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    // Delete student
    const student = await Student.deleteStudent(req.params.studId);
    if (!student) return next(new AppError("Student does not exist", 404));

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "Student deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete all students in tenant
export const deleteAllStudentsInTenant: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    // Check delete key
    const { delete_key } = <StudentRequests.IDeleteKey>req.value;
    if (delete_key !== configs.delete_key)
      return next(new AppError("Please provide a valid delete key", 400));

    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School does not exist", 404));

    // Check the logged in user owns/belongs to the school
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    // Delete students in the tenant
    await Student.deleteAllStudentsInTenant(school.id);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: `All students in ${school.school_name} deleted permanently`,
    });
  } catch (error) {
    next(error);
  }
};
