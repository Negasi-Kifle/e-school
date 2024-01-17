import PCOSTModel from "./model";
import IPCOSTDoc from "./dto";
import APIFeatures from "../../utils/api_features";

export default class PCOST {
  // Create a pcost
  static async createPCOST(
    data: PCOSTRequest.ICreatePCOSTInput
  ): Promise<IPCOSTDoc> {
    try {
      const pcost = await PCOSTModel.create(data);
      return pcost;
    } catch (error) {
      throw error;
    }
  }

  // Update a pcost
  static async updatePCOST(
    data: PCOSTRequest.IUpdatePCOSTInput,
    id: string
  ): Promise<IPCOSTDoc | null> {
    try {
      const pcost = await PCOSTModel.findByIdAndUpdate(id, data);
      return pcost;
    } catch (error) {
      throw error;
    }
  }

  // Get all pcosts
  static async getAllPCOSTs(query?: RequestQuery): Promise<IPCOSTDoc[]> {
    try {
      // const pcosts = await PCOSTModel.find();
      const apiFeature = new APIFeatures<IPCOSTDoc>(
        PCOSTModel.find()
          .populate({
            path: "pco",
            select: "pmt_title start_date deadline amount penality penality",
          })
          .populate({
            path: "student",
            select: "first_name last_name full_name level",
          })
          .populate({
            path: "parent",
            select: "first_name last_name full_name phone_number",
          }),
        query
      )
        .filter()
        .sort()
        .project();

      const pcosts = await apiFeature.dbQuery;
      return pcosts;
    } catch (error) {
      throw error;
    }
  }

  // Get a pcost
  static async getPCOST(id: string): Promise<IPCOSTDoc | null> {
    try {
      const pcost = await PCOSTModel.findById(id)
        .populate({
          path: "pco",
          select: "pmt_title start_date deadline amount penality",
        })
        .populate({
          path: "student",
          select: "first_name last_name full_name level",
        })
        .populate({
          path: "parent",
          select: "first_name last_name full_name phone_number",
        });
      return pcost;
    } catch (error) {
      throw error;
    }
  }

  // Get a pcost by PCO id
  static async getPCOSTByPCO(id: string): Promise<IPCOSTDoc | null> {
    try {
      const pcost = await PCOSTModel.findOne({ pco: id })
        .populate({
          path: "pco",
          select: "pmt_title start_date deadline amount penality",
        })
        .populate({
          path: "student",
          select: "first_name last_name full_name level",
        })
        .populate({
          path: "parent",
          select: "first_name last_name full_name phone_number",
        });
      return pcost;
    } catch (error) {
      throw error;
    }
  }

  // Get a pcost by student id
  static async getPCOSTByStudent(id: string): Promise<IPCOSTDoc | null> {
    try {
      const pcost = await PCOSTModel.findOne({ student: id })
        .populate({
          path: "pco",
          select: "pmt_title start_date deadline amount penality",
        })
        .populate({
          path: "student",
          select: "first_name last_name full_name level",
        })
        .populate({
          path: "parent",
          select: "first_name last_name full_name phone_number",
        });
      return pcost;
    } catch (error) {
      throw error;
    }
  }

  // Get a pcost by student id
  static async getPCOSTByParent(id: string): Promise<IPCOSTDoc[]> {
    try {
      const pcost = await PCOSTModel.find({ parent: id })
        .populate({
          path: "pco",
          select: "pmt_title start_date deadline amount penality",
        })
        .populate({
          path: "student",
          select: "first_name last_name full_name level",
        })
        .populate({
          path: "parent",
          select: "first_name last_name full_name phone_number",
        });
      return pcost;
    } catch (error) {
      throw error;
    }
  }

  // Delete a pcost permaently
  static async deletePCOST(id: string): Promise<any> {
    try {
      const pcost = await PCOSTModel.findByIdAndDelete(id);
      return pcost;
    } catch (error) {
      throw error;
    }
  }

  // Delete all pcosts
  static async deleteAllPCOSTs() {
    try {
      await PCOSTModel.deleteMany({});
    } catch (error) {
      throw error;
    }
  }
}
