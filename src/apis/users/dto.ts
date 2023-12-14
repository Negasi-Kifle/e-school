import { Document } from "mongoose";

// Structure of the users model
export default interface IUsersDoc extends Document {
  first_name: string;
  last_name: string;
  phone_num: string;
  role: string;
  status: "Active" | "Inactive";
  password: string;
  is_default_pswd: boolean;
  is_credential_changed: boolean;
  tenant_id: string;
  address: string;
  prof_img: IProfileImg;
}

// Keys in a profile image
export interface IProfileImg {
  secure_url: string;
  public_id: string;
}

// Structure of incoming data
declare global {
  namespace UserRequests {
    interface ICreateInput {
      first_name: string;
      last_name: string;
      phone_num: string;
      role: string;
      status: "Active" | "Inactive";
      password: string;
      is_default_pswd: boolean;
      is_credential_changed: boolean;
      tenant_id: string;
      address: string;
      prof_img: IProfileImg;
    }
  }
}
