import { Document } from "mongoose";

export default interface IParentDoc extends Document {
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  is_default_password: boolean;
  password: string;
  password_changed_at: Date;
  is_credential_changed: Boolean;
  otp: string;
  otp_expiry: Date;
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
    interface IUpdatePhoneNumber {
      phone_number: string;
    }
    interface IUpdateParentPassword {
      default_password: string;
      password: string;
      password_confirm: string;
    }
    interface IUpdatePassword {
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
    interface IForgotPswd {
      phone_number: string;
    }

    interface IUpdateOTP {
      otp: string;
      otp_expiry: Date;
    }
    interface IResetPswd {
      phone_number: string;
      pin: string;
      pin_confirm: string;
    }
  }
}
