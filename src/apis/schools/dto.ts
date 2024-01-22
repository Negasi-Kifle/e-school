import { Document } from "mongoose";

export default interface ISchoolDoc extends Document {
  school_name: string;
  school_name_slug: string;
  school_address: string;
  school_logo: ILogo;
  license: string;
  level: string;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}

// Logo url in cloudinary
export interface ILogo {
  secure_url: string;
  public_id: string;
}

declare global {
  namespace SchoolRequest {
    interface ICreateSchoolInput {
      school_name: string;
      school_name_slug: string;
      school_address: string;
      school_logo: ILogo;
      license: string;
      owner: string;
      level: string;
    }

    interface IUpdateSchoolInput {
      school_name: string;
      school_name_slug: string;
      school_address: string;
      school_logo: ILogo;
      license: string;
      level: string;
    }

    interface IUpdateStatus {
      status: string;
    }

    interface IDeleteAllSchools {
      delete_key: string;
    }
  }
}
