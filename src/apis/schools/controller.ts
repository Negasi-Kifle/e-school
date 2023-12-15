import { RequestHandler } from "express";
import AppError from "../../utils/app_error";
import School from "./dal";
import ISchoolDoc from "./dto";
import configs from "../../configs";
import IAdminDoc from "../admin/dto";

// Create a school
export const createSchool: RequestHandler = async (req, res, next) => {
  try {
    // Get body
    const { school_name, school_address, license, level, owner } = <
      SchoolRequest.ICreateSchoolInput
    >req.value;

    //check school exists
    const school = await School.getSchoolByName(school_name);
    if (school) {
      return next(new AppError("School already exists", 400));
    }

    // Create a school
    await School.createSchool({
      school_name,
      school_address,
      license,
      level,
      owner,
    });

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: `School created successfuly!`,
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

export const getSchoolByOwner: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const school = await School.getSchoolByOwner(id);

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
