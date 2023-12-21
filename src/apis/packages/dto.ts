import { Document } from "mongoose";

// Structure of the model for packages
export default interface IPmtPackageDoc extends Document {
  pack_name: string;
  pack_name_slug: string;
  num_of_months: string;
  discount: string;
  tenant_id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Structure of data in different incoming requests
declare global {
  namespace PmtPackageRequests {
    interface ICreatePmtPackage {
      pack_name: string;
      pack_name_slug: string;
      num_of_months: string;
      discount: string;
      tenant_id: string;
    }
  }
}
