import { Document } from "mongoose";

export default interface IPCOSTDoc extends Document {
  pco: string;
  student: string;
  parent: string;
  is_paid: boolean;
  is_before_deadline: boolean;
  paid_amount: number;
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
