import { RequestHandler } from "express";
import AppError from "../../utils/app_error";
import PCOST from "./dal";
import IPCOSTDoc from "./dto";
import configs from "../../configs";
import IAdminDoc from "../admin/dto";
import UserDAL from "../users/dal";
import StudentDAL from "../students/dal";

// Create a pcost
export const createPCOST: RequestHandler = async (req, res, next) => {
  try {
    // Get body
    const data = <PCOSTRequest.ICreatePCOSTInput>req.value;

    // Check student exists
    const student = await StudentDAL.getStudentById(data.student);
    if (!student) return next(new AppError("Student does not exist", 404));

    // Add parent id of the student to "data"
    data.parent = student.parent;
    data.is_paid_at = new Date();

    // Create a pcost
    const pcost = await PCOST.createPCOST(data);

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: `PCOST created successfuly!`,
      data: { pcost },
    });
  } catch (error) {
    next(error);
  }
};

// update a pcost
export const updatePCOST: RequestHandler = async (req, res, next) => {
  try {
    // Get body
    const data = <PCOSTRequest.ICreatePCOSTInput>req.value;

    const pcost = await PCOST.getPCOST(req.params.id);

    if (!pcost) {
      return next(new AppError("PCOST does not exist", 400));
    }

    // Update a pcost
    await PCOST.updatePCOST(data, req.params.id);

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: `PCOST updated successfuly!`,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePCOST: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;

    const pcost = await PCOST.deletePCOST(id);

    if (!pcost) {
      return next(new AppError("PCOST does not exists", 400));
    }

    res.status(200).json({
      status: "SUCCESS",
      message: "PCOST deleted successfuly.",
    });
  } catch (err) {
    next(err);
  }
};

export const getPCOSTs: RequestHandler = async (req, res, next) => {
  try {
    const pcosts = await PCOST.getAllPCOSTs();

    res.status(200).json({
      status: "SUCCESS",
      results: pcosts.length,
      data: { pcosts },
    });
  } catch (err) {
    next(err);
  }
};

export const getPCOSTById: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const pcost = await PCOST.getPCOST(id);

    if (!pcost) {
      return next(new AppError("PCOST does not exist", 490));
    }

    res.status(200).json({
      status: "SUCCESS",
      data: { pcost },
    });
  } catch (err) {
    next(err);
  }
};
export const getPCOSTByPCO: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const pcost = await PCOST.getPCOSTByPCO(id);

    if (!pcost) {
      return next(new AppError("PCO of PCOST does not exist", 490));
    }

    res.status(200).json({
      status: "SUCCESS",
      data: { pcost: [pcost] },
    });
  } catch (err) {
    next(err);
  }
};

export const getPCOSTByPCOSTtudent: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const pcost = await PCOST.getPCOSTByStudent(id);

    res.status(200).json({
      status: "SUCCESS",
      data: { pcost },
    });
  } catch (err) {
    next(err);
  }
};

export const getPCOSTByParent: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const pcosts = await PCOST.getPCOSTByParent(id);

    res.status(200).json({
      status: "SUCCESS",
      results: pcosts.length,
      data: { pcosts },
    });
  } catch (err) {
    next(err);
  }
};

// Delete all pcosts except for the first account
export const deleteAllPCOSTs: RequestHandler = async (req, res, next) => {
  try {
    // Get delete key
    const { delete_key } = <PCOSTRequest.IDeleteAllPCOSTs>req.value;

    // Check the validity of the delete key
    if (configs.delete_key !== delete_key)
      return next(new AppError("Invalid delete key", 401));

    // Check if the pcost is first account holder
    const user = <IAdminDoc>req.user;
    if (!user.first_account)
      return next(
        new AppError(
          "The adminstrator with the first account on the system can only delete pcosts",
          401
        )
      );

    await PCOST.deleteAllPCOSTs();

    // Respond
    res.status(200).json({
      status: "SUCCESS",
      message: "All PCOST accounts are deleted",
    });
  } catch (error) {
    next(error);
  }
};

// Get all unpaid fees of a student
export const getUnpaidFeesOfStudent: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const unpaidFees = await PCOST.getUnpaidFeeOfStudent(req.params.studId);

    // Response
    res.status(200).json({
      status: "SUCCESS",
      data: { unpaidFees },
    });
  } catch (error) {
    next(error);
  }
};
