import APIFeatures from "../../utils/api_features";
import IPCODoc from "./dto";
import PCO from "./model";

/**
 * Data access layer for data related to PCO(payment-collection-order)
 */
export default class PCODAL {
  // Create PCO
  static async createPCO(data: PCORequests.ICreatePCO): Promise<IPCODoc> {
    try {
      const pco = await PCO.create(data);
      return pco;
    } catch (error) {
      throw error;
    }
  }

  // Get all PCOs in tenant
  static async getAllInTenant(
    tenant_id: string,
    query?: RequestQuery
  ): Promise<IPCODoc[]> {
    try {
      const apiFeatures = new APIFeatures(
        PCO.find({ tenant_id }).populate({
          path: "tenant_id",
          select: "school_name school_address level",
        }),
        query
      )
        .paginate()
        .project()
        .sort()
        .filter();

      const tenantPCOs = await apiFeatures.dbQuery;
      return tenantPCOs;
    } catch (error) {
      throw error;
    }
  }

  // Get all PCOs in DB
  static async getAllInDB(query?: RequestQuery): Promise<IPCODoc[]> {
    try {
      const apiFeatures = new APIFeatures(
        PCO.find().populate({
          path: "tenant_id",
          select: "school_name school_address level",
        }),
        query
      )
        .paginate()
        .project()
        .filter()
        .sort();

      const allPCOs = await apiFeatures.dbQuery;
      return allPCOs;
    } catch (error) {
      throw error;
    }
  }

  // Get PCO by id
  static async getById(
    _id: string,
    tenant_id: string
  ): Promise<IPCODoc | null> {
    try {
      // Check school exists
      const school = await PCO.findOne({ _id, tenant_id }).populate({
        path: "tenant_id",
        select: "school_name school_address level",
      });
      return school;
    } catch (error) {
      throw error;
    }
  }

  // Update PCO info
  static async updatePCO(
    id: string,
    data: PCORequests.IUpdateInput
  ): Promise<IPCODoc | null> {
    try {
      const pco = await PCO.findByIdAndUpdate(id, data, {
        runValidators: true,
        new: true,
      });
      return pco;
    } catch (error) {
      throw error;
    }
  }

  // Delete all PCOs in tenant or  DB
  static async deleteAllPCOs(tenant_id?: string): Promise<void> {
    try {
      if (tenant_id) {
        await PCO.deleteMany({ tenant_id });
      } else {
        await PCO.deleteMany();
      }
    } catch (error) {
      throw error;
    }
  }

  // Delete PCO by id
  static async deleteById(id: string): Promise<IPCODoc | any> {
    try {
      const deletedPco = await PCO.findByIdAndDelete(id);
      return deletedPco;
    } catch (error) {
      throw error;
    }
  }
}
