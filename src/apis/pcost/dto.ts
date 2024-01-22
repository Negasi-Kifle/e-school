import { Document } from "mongoose";

export default interface IPCOSTDoc extends Document {
  pco: string;
  student: string;
  parent: string;
  is_paid: boolean;
  is_before_deadline: boolean;
  paid_amount: number;
  is_paid_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace PCOSTRequest {
    interface ICreatePCOSTInput {
      pco: string;
      student: string;
      parent: string;
      is_paid: boolean;
      is_before_deadline: boolean;
      paid_amount: number;
      is_paid_at: Date;
    }
   
    interface IUpdatePCOSTInput {
      pco: string;
      student: string;
      parent: string;
      is_paid: boolean;
      is_before_deadline: boolean;
      paid_amount: number;
    }
 
    interface IDeleteAllPCOSTs {
      delete_key: string;
    }
  }
}
