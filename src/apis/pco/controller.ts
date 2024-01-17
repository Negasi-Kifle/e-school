import { RequestHandler } from "express";
import PCO from "./dal";
import School from "../schools/dal";
import AppError from "../../utils/app_error";
import IUsersDoc from "../users/dto";
import checkOwnership from "../students/utils/check_ownership";
import slugifer from "../../utils/slugfier";
import createPcosts from "./utils/create_pcosts";

// Create PCO
export const createPCO: RequestHandler = async (req, res, next) => {
  let pcoId = "PcoId";
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

    const existsingPCO = await PCO.getPCOBySlugAndTenant(data.pmt_title_slug, data.tenant_id)
    if(existsingPCO){
      return next(new AppError("PCO already exitsts", 404));
    }
    
    // Create PCO
    const pco = await PCO.createPCO(data);
    pcoId = pco.id;

    const pcostData = <PCORequests.ICreatePcosts>{
      grades: data.grades,
      tenant_id: data.tenant_id,
      pco: pco.id,
    };

    console.log(pcostData)

    // Create all PCOSts for the selected levels and grades
    await createPcosts(pcostData);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "New payment collection order created successfully",
      data: { pco },
    });
  } catch (error) {
    console.log(error)
    if (pcoId !== "PcoId") await PCO.deleteById(pcoId);
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

// Get PCO by id
export const getById: RequestHandler = async (req, res, next) => {
  try {
    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School does not exist", 404));

    // Check the logged in user has the previlege for this operaiton
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    // Fetch PCO by id
    const pco = await PCO.getById(req.params.pcoId, school.id);
    if (!pco) return next(new AppError("PCO not found", 404));

    // Response
    res.status(200).json({
      status: "SUCCESS",
      data: { pco },
    });
  } catch (error) {
    next(error);
  }
};

// Update PCO
export const updatePCO: RequestHandler = async (req, res, next) => {
  try {
    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School does not exist", 404));

    // Check the logged in user has the previlege for this operation
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    // Incoming data
    const data = <PCORequests.IUpdateInput>req.value;
    if (data.pmt_title)
      data.pmt_title_slug = slugifer(data.pmt_title.toLowerCase());

    // Update PCO
    const pco = await PCO.updatePCO(req.params.pcoId, data);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "PCO updated successfully",
      data: { pco },
    });
  } catch (error) {
    next(error);
  }
};

// Delete tenant PCOs
export const deleteTenantPCOs: RequestHandler = async (req, res, next) => {
  try {
    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School does not exist", 404));

    // Check the logged in user has the previlege for this operation
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    // Delete all
    await PCO.deleteAllPCOs(req.params.tenantId);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: `All PCOs in ${school.school_name} deleted permanently`,
    });
  } catch (error) {
    next(error);
  }
};

// Delete all PCOs in DB
export const deleteAllInDB: RequestHandler = async (req, res, next) => {
  try {
    await PCO.deleteAllPCOs(); // Delete all PCOs in DB

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "All PCOs in the whole DB deleted permanently",
    });
  } catch (error) {
    next(error);
  }
};

// Delete PCO by id
export const deleteById: RequestHandler = async (req, res, next) => {
  try {
    // Check school exists
    const school = await School.getSchool(req.params.tenantId);
    if (!school) return next(new AppError("School does not exist", 404));

    // Check the logged in user has the previlege for this operation
    const loggedInUser = <IUsersDoc>req.user;
    checkOwnership(loggedInUser, school);

    // Delete PCO
    const pco = await PCO.deleteById(req.params.pcoId);
    if (!pco) return next(new AppError("PCO does not exist", 404));

    // Response
    res.status(200).json({
      status: "SUCCESS",
      message: "PCO deleted permanently",
    });
  } catch (error) {
    next(error);
  }
};
