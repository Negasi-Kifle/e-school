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
  comparePassword: (incomingPswd: string, pswdInDB: string) => boolean;
}

// Keys in a profile image
export interface IProfileImg {
  secure_url: string;
  public_id: string;
}

// Structure of incoming data
declare global {
  namespace UserRequests {
    interface ICreateOwnerInput {
      first_name: string;
      last_name: string;
      phone_num: string;
      role: "Owner";
      status: "Active";
      password: string;
      is_default_pswd: true;
      is_credential_changed: false;
      tenant_id: string;
      address: string;
      prof_img: IProfileImg;
    }
    interface IDeleteAll {
      delete_key: string;
    }
    interface ILogin {
      phone_num: string;
      password: string;
    }
    interface IUpdateProfile {
      first_name: string;
      last_name: string;
      address: string;
    }
    interface IChangePswd {
      curr_pswd: string;
      new_pswd: string;
    }
  }
}
