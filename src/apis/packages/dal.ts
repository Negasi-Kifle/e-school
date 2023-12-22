import PmtPackage from "./model";
import IPmtPackageDoc from "./dto";
import APIFeatures from "../../utils/api_features";

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

  // Get all packages in a tenant
  static async getTenantPackages(
    tenant_id: string,
    query?: RequestQuery
  ): Promise<IPmtPackageDoc[]> {
    try {
      const apiFeatures = new APIFeatures(PmtPackage.find({ tenant_id }), query)
        .paginate()
        .project()
        .filter()
        .sort();

      const pmtPackages = await apiFeatures.dbQuery;
      return pmtPackages;
    } catch (error) {
      throw error;
    }
  }

  // Get all packages in DB
  static async getAllPackagesInDB(
    query?: RequestQuery
  ): Promise<IPmtPackageDoc[]> {
    try {
      const apiFeatures = new APIFeatures(PmtPackage.find(), query);

      const pmtPackages = await apiFeatures.dbQuery;
      return pmtPackages;
    } catch (error) {
      throw error;
    }
  }
}
