import PmtPackage from "./model";
import IPmtPackageDoc from "./dto";

/**
 * Data access layer for package related data
 */
export default class PackageDAL {
  // Create package
  static async createPmtPack(
    data: PmtPackageRequests.ICreatePmtPackage
  ): Promise<IPmtPackageDoc> {
    try {
      const pmtPackage = await PmtPackage.create(data);
      return pmtPackage;
    } catch (error) {
      throw error;
    }
  }
}
