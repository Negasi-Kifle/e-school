import { RequestHandler } from "express";
import AppError from "../../utils/app_error";
import PackageDAL from "./dal";
import slugifer from "../../utils/slugfier";
import School from "../schools/dal";
import IUsersDoc from "../users/dto";
import checkOwnership from "../students/utils/check_ownership";
import configs from "../../configs";

// Create package
export const createPack: RequestHandler = async (req, res, next) => {
  try {
    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School does not exist", 404));

    // Check the logged in user owns/belongs to the school
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    // Incoming data
    const data = <PmtPackageRequests.ICreatePmtPackage>req.value;

    // Slugify
    data.pack_name_slug = slugifer(data.pack_name.toLowerCase());
    data.tenant_id = school.id;

    // Create package
    const pack = await PackageDAL.createPmtPack(data);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "New package creates successfully",
      data: { package: pack },
    });
  } catch (error) {
    next(error);
  }
};

// Get all payment packages in a tenant
export const getTenantPackages: RequestHandler = async (req, res, next) => {
  try {
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School does not exist", 404));

    // Check the logged in user owns/belongs to the school
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    // Get packages
    const pmtPackages = await PackageDAL.getTenantPackages(
      school.id,
      req.query
    );

    // Response
    res.status(200).json({
      status: "SUCCESS",
      results: pmtPackages.length,
      data: { pmtPackages },
    });
  } catch (error) {
    next(error);
  }
};

// Get all packages in DB
export const getAllPackagesInDB: RequestHandler = async (req, res, next) => {
  try {
    const pmtPackages = await PackageDAL.getAllPackagesInDB(req.query);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      results: pmtPackages.length,
      data: { pmtPackages },
    });
  } catch (error) {
    next(error);
  }
};

// Get package by id
export const getPackageById: RequestHandler = async (req, res, next) => {
  try {
    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School does not exist", 404));

    // Check the logged in user owns/belongs the school
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    // Get package
    const pmtPackage = await PackageDAL.getPackageById(req.params.packId);
    if (!pmtPackage) return next(new AppError("Package does not exist", 404));

    // Response
    res.status(200).json({
      status: "SUCCESS",
      data: { pmtPackage },
    });
  } catch (error) {
    next(error);
  }
};

// Update package
export const updatePackage: RequestHandler = async (req, res, next) => {
  try {
    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School does not exist", 404));

    // Check logged in user owns/belongs to the school
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    // Incoming data
    const data = <PmtPackageRequests.IUpdatePmtPackage>req.value;
    if (data.pack_name_slug)
      data.pack_name_slug = slugifer(data.pack_name.toLowerCase()); // Slugify name

    // Update package
    const pmtPackage = await PackageDAL.updatePackage(req.params.packId, data);
    if (!pmtPackage) return next(new AppError("Package does not exist", 404));

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "Payment package updated successfully",
      data: { pmtPackage },
    });
  } catch (error) {
    next(error);
  }
};

// Delete all packages in tenant
export const deleteTenantPackages: RequestHandler = async (req, res, next) => {
  try {
    // Check delete is correct
    const { delete_key } = <PmtPackageRequests.IDeleteAll>req.value;
    if (delete_key !== configs.delete_key)
      return next(new AppError("Please provide a valid delete key", 400));

    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("Schoold does not exist", 404));

    // Check the logged in user has the previllege to the operation
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    // Delete all packages in tenant
    await PackageDAL.deleteTenantPackages(school.id);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: `All payment packages in ${school.school_name} deleted permanently`,
    });
  } catch (error) {
    next(error);
  }
};

// Delete all packages in DB
export const deletePackagesInDB: RequestHandler = async (req, res, next) => {
  try {
    // Check delete key
    const { delete_key } = <PmtPackageRequests.IDeleteAll>req.value;
    if (delete_key !== configs.delete_key)
      return next(new AppError("Please provide a valid delete key", 400));

    await PackageDAL.deleteAllInDB(); // Delete all packages in DB

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "All packages in DB deleted permanently",
    });
  } catch (error) {
    next(error);
  }
};

// Delete by id
export const deleteById: RequestHandler = async (req, res, next) => {
  try {
    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School does not exist", 404));

    // Check the logged in user has previlege to do the operation
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    // Delete package
    const deleteCount = await PackageDAL.deleteById(
      req.params.packId,
      school.id
    );

    if (deleteCount === 0)
      return next(new AppError("Package does not exist", 404));

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "Payment package deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
