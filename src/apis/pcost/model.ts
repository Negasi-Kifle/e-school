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
    },
    is_before_deadline: {
      type: Boolean,
      default: false,
    },
    paid_amount: {
      type: Number,
      default: 0,
      min: [0, "Paid amount must be greater than ot equal to zero"],
    },
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
