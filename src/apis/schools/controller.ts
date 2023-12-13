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
    const { school_name, school_address, license, level } = <
      SchoolRequest.ICreateSchoolInput
    >req.value;

   //check school exists
   const school = await School.getSchoolByName(school_name);
   if(school){
    return next(new AppError("School already exists", 400));
   }

    // Create a school
    await School.createSchool({school_name, school_address, license, level});

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: `School created successfuly!`
    });
  } catch (error) {
    next(error);
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

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message:
        "All school accounts are deleted",
    });
  } catch (error) {
    next(error);
  }
};
