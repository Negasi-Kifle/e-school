import { Document } from "mongoose";

export default interface ISchoolDoc extends Document {
  school_name: string;
  school_address: string;
  license: string;
  level: string;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace SchoolRequest {
    interface ICreateSchoolInput {
      school_name: string;
      school_address: string;
      license: string;
      level: string;
    }
 
    interface IDeleteAllSchools {
      delete_key: string;
    }
  }
}
