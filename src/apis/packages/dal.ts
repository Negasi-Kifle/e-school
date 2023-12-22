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

  // Get package by id
  static async getPackageById(id: string): Promise<IPmtPackageDoc | null> {
    try {
      const pmtPackage = await PmtPackage.findById(id);
      return pmtPackage;
    } catch (error) {
      throw error;
    }
  }

  // Update package info
  static async updatePackage(
    id: string,
    data: PmtPackageRequests.IUpdatePmtPackage
  ): Promise<IPmtPackageDoc | null> {
    try {
      const pmtPackage = await PmtPackage.findByIdAndUpdate(id, data, {
        runValidators: true,
        new: true,
      });
      return pmtPackage;
    } catch (error) {
      throw error;
    }
  }

  // Delete all pacakges in a tenant
  static async deleteTenantPackages(tenant_id: string) {
    try {
      await PmtPackage.deleteMany({ tenant_id });
    } catch (error) {
      throw error;
    }
  }

  // Delete all in DB
  static async deleteAllInDB() {
    try {
      await PmtPackage.deleteMany();
    } catch (error) {
      throw error;
    }
  }

  // Delete package by id
  static async deleteById(id: string, tenant_id: string): Promise<any> {
    try {
      const pmtPackage = await PmtPackage.deleteOne({ _id: id, tenant_id });
      return pmtPackage.deletedCount;
    } catch (error) {
      throw error;
    }
  }
}
