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
}
