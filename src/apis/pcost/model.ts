import mongoose, { Schema } from "mongoose";
import IPCOSTsDoc from "./dto";

// PCOSTs schema
const pcostSchema = new Schema(
  {
    pco: {
      type: Schema.ObjectId,
      ref: "PCO",
      required: [true, "PCO is required"],
    },
    student: {
      type: Schema.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
    },
    parent: {
      type: Schema.ObjectId,
      ref: "Parent",
      required: [true, "Parent is required"],
    },
    is_paid: {
      type: Boolean,
      default: false,
      required: [true, "Is Paid is required"],
    },
    is_before_deadline: {
      type: Boolean,
      default: false,
      required: [true, "Is Before Deadline is required"],
    },
    paid_amount: { type: Number, required: [true, "Paid Amount is requried"] },
  },
  {
    writeConcern: {
      w: "majority",
      j: true,
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// PCOSTs model
const PCOST = mongoose.model<IPCOSTsDoc>("PCOST", pcostSchema);

// Export pcosts model
export default PCOST;
