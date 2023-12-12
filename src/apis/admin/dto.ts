import { Document } from "mongoose";

export default interface IAdminDoc extends Document {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  is_default_password: boolean;
  password: string;
  password_confirm: string | undefined;
  first_account: boolean;
  password_changed_at: Date;
  email_phone_number_changed_at: Boolean;
  account_status: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidatePassword: string, password: string) => boolean;
  checkPasswordChangedAt: (iat: number) => boolean;
}

declare global {
  namespace AdminRequest {
    interface ICreateFirstAdminInput {
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      first_account: boolean;
      default_password: string;
    }
    interface ICreateAdminInput {
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      role: string;
      default_password: string;
    }
    interface IAdminLogin {
      email_or_phone: string;
      password: string;
    }
    interface IUpdateDefaultPassword {
      default_password: string;
      password: string;
      password_confirm: string;
    }
    interface IUpdateAdminProfile {
      first_name?: string;
      last_name?: string;
    }
    interface IUpdateEmailOrPhoneNumber {
      email: string;
      phone_number: string;
    }
    interface IUpdateAdminRole {
      role: string;
      id: string;
    }
    interface IUpdateAdminPassword {
      current_password: string;
      password: string;
      password_confirm: string;
    }
    interface IResetAdminPassword {
      id: string;
    }
    interface IUpdateAccountStatus {
      id: string;
      account_status: string;
    }
    interface IDeleteAllAdmins {
      delete_key: string;
    }
  }
}
