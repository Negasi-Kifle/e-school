import { Document } from "mongoose";

// Structure of model of the payment-collection-order
export default interface IPCODoc extends Document {
  pmt_title: string;
  pmt_title_slug: string;
  description: string;
  start_date: Date;
  deadline: Date;
  amount: Number;
  penality: number;
  levels: string;
  grades: string;
  tenant_id: string;
  pmt_package: string;
  pmt_package_deadline: Date;
  status: "Active" | "Inactive";
}

// Structure of data in different incoming requests
declare global {
  namespace PCORequests {
    interface ICreatePCO {
      pmt_title: string;
      pmt_title_slug: string;
      description: string;
      start_date: Date;
      deadline: Date;
      amount: Number;
      penality: number;
      levels: string;
      grades: string;
      tenant_id: string;
      pmt_package: string;
      pmt_package_deadline: Date;
    }
    interface IUpdateInput {
      pmt_title: string;
      pmt_title_slug: string;
      description: string;
      start_date: Date;
      deadline: Date;
      amount: Number;
      penality: number;
      levels: string;
      grades: string;
      tenant_id: string;
      pmt_package: string;
      pmt_package_deadline: Date;
    }
  }
}
