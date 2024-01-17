import mongoose, { Schema } from "mongoose";
import IPCODoc from "./dto";

// Schema of the PCO model
const pcoSchema = new Schema(
  {
    pmt_title: {
      type: String,
      required: [true, "Payment title is required"],
    },
    pmt_title_slug: {
      type: String,
      required: [true, "Slug of payment title is required"],
    },
    description: {
      type: String,
      required: [true, "Describe the payment collection order"],
    },
    start_date: {
      type: Date,
      min: [new Date(), "Start date can not be in the past"],
      required: [true, "Start date of the PCO is required"],
    },
    deadline: {
      type: Date,
      required: [true, "Deadline of the PCO is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount of payment is required"],
    },
    penality: {
      type: Number,
      default: 0,
      min: [0, "Penality can not be less than zero"],
    },
    grades: [
      {
        type: String,
        default: "All",
      },
    ],
    tenant_id: {
      type: Schema.ObjectId,
      ref: "School",
      required: [true, "School is required"],
    },
    pmt_package: {
      type: Schema.ObjectId,
      ref: "Package",
    },
    pmt_package_deadline: Date,
    status: {
      type: String,
      enum: {
        values: ["Active", "Inactive"],
        message: "Status must be either Active or Inactive",
      },
    },
  },
  {
    writeConcern: {
      w: "majority",
      j: true,
    },
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// PCO model
const PCO = mongoose.model<IPCODoc>("PCO", pcoSchema);

// new Promise((resolve, reject)=>{
//   resolve(PCO.collection.drop().catch((err)=> console.log(err)));
// });

// Export PCO model
export default PCO;
