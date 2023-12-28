import { RequestHandler } from "express";
import AppError from "../../utils/app_error";
import School from "./dal";
import ISchoolDoc from "./dto";
import configs from "../../configs";
import IAdminDoc from "../admin/dto";
import UserDAL from "../users/dal";
import IUsersDoc from "../users/dto";

// Create a school
export const createSchool: RequestHandler = async (req, res, next) => {
  try {
    // Get body
    const data = <SchoolRequest.ICreateSchoolInput>req.value;

    // Check the owner exists
    const owner = await UserDAL.getOwnerById(data.owner);
    if (!owner) return next(new AppError("Unknown owner selected", 404));

    //check school exists
    const schoolInDb = await School.getSchoolByName(data.school_name);
    if (schoolInDb) {
      return next(new AppError("School already exists", 400));
    }

    // Create a school
    const school = await School.createSchool(data);

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: `School created successfuly!`,
      data: { school },
    });
  } catch (error) {
    next(error);
  }
};

// update a school
export const updateSchool: RequestHandler = async (req, res, next) => {
  try {
    // Get body
    const data = <SchoolRequest.ICreateSchoolInput>req.value;

    //check school name is not taken
    if (data.school_name) {
      const school = await School.getSchool(req.params.id);

      const schoolName = await School.getSchoolByName(data.school_name);
      if (schoolName && school!.school_name) {
        return next(new AppError("School Name already exists", 400));
      }
    }

    // Update a school
    const schoolExists = await School.updateSchool(data, req.params.id);
    if (!schoolExists) {
      return next(new AppError("School does not exists", 400));
    }

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: `School updated successfuly!`,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSchoolStatus: RequestHandler = async (req, res, next) => {
  try {
    const data = <SchoolRequest.IUpdateStatus>req.value;

    const schools = await School.updateSchoolStatus(data, req.params.id);

    res.status(200).json({
      status: "SUCCESS",
      message: "School status changed successfuly",
      data: { schools },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteSchool: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;

    const school = await School.deleteSchool(id);

    if (!school) {
      return next(new AppError("School does not exists", 400));
    }

    res.status(200).json({
      status: "SUCCESS",
      message: "School deleted successfuly.",
    });
  } catch (err) {
    next(err);
  }
};

export const getSchools: RequestHandler = async (req, res, next) => {
  try {
    const schools = await School.getAllSchools();

    res.status(200).json({
      status: "SUCCESS",
      results: schools.length,
      data: { schools },
    });
  } catch (err) {
    next(err);
  }
};

export const getSchoolById: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const school = await School.getSchool(id);

    if (!school) {
      return next(new AppError("School does not exist", 490));
    }

    res.status(200).json({
      status: "SUCCESS",
      data: { school },
    });
  } catch (err) {
    next(err);
  }
};

export const getSchoolsByOwner: RequestHandler = async (req, res, next) => {
  try {
    // If logged in user is owner, check id in the request params matches with owner's id
    const loggedInUser = <IUsersDoc>req.user;
    if (
      loggedInUser.role === "Owner" &&
      loggedInUser.id !== req.params.ownerId
    ) {
      return next(
        new AppError(
          "You can see only schools registered under your account.",
          400
        )
      );
    }

    // Get schools of an owner
    const schools = await School.getSchoolsByOwner(req.params.ownerId);

    res.status(200).json({
      status: "SUCCESS",
      results: schools.length,
      data: { schools },
    });
  } catch (err) {
    next(err);
  }
};

export const getStudentsBySchoolId: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const school = await School.getSchoolsByOwner(id);

    res.status(200).json({
      status: "SUCCESS",
      data: { school },
    });
  } catch (err) {
    next(err);
  }
};

// Delete all schools except for the first account
export const deleteAllSchools: RequestHandler = async (req, res, next) => {
  try {
    // Get delete key
    const { delete_key } = <SchoolRequest.IDeleteAllSchools>req.value;

    // Check the validity of the delete key
    if (configs.delete_key !== delete_key)
      return next(new AppError("Invalid delete key", 401));

    // Check if the school is first account holder
    const user = <IAdminDoc>req.user;
    if (!user.first_account)
      return next(
        new AppError(
          "The adminstrator with the first account on the system can only delete schools",
          401
        )
      );

    await School.deleteAllSchools();

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "All school accounts are deleted",
    });
  } catch (error) {
    next(error);
  }
};
