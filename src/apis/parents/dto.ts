import { Document } from "mongoose";

export default interface IParentDoc extends Document {
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  is_default_password: boolean;
  password: string;
  password_changed_at: Date;
  phone_number_changed_at: Boolean;
  account_status: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidatePassword: string, password: string) => boolean;
  checkPasswordChangedAt: (iat: number) => boolean;
}

declare global {
  namespace ParentRequest {
    interface ICreateParentInput {
      first_name: string;
      last_name: string;
      address: string;
      phone_number: string;
      password: string;
      profile_img:{
        secure_url: string;
        public_id: string;
      }
    }
    interface IParentLogin {
      phone_number: string;
      password: string;
    }
    interface IUpdateParentProfile {
      first_name?: string;
      last_name?: string;
    }
    interface IUpdatePhoneNumber {
      email: string;
      phone_number: string;
    }
    interface IUpdateParentPassword {
      current_password: string;
      password: string;
      password_confirm: string;
    }
    interface IResetParentPassword {
      id: string;
    }
    interface IUpdateAccountStatus {
      id: string;
      account_status: string;
    }
    interface IDeleteAllParents {
      delete_key: string;
    }
  }
}
