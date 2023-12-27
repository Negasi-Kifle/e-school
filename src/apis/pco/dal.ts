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
      const apiFeatures = new APIFeatures(PCO.find({ tenant_id }), query)
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
}
