import mongoose, { Schema } from "mongoose";
import IPmtPackageDoc from "./dto";

// Schema for the packages model
const pmtPacksSchema = new Schema(
  {
    pack_name: {
      type: String,
      required: [true, "Package name is required"],
    },
    pack_name_slug: {
      type: String,
      required: [true, "Slug of the package name is required"],
    },
    num_of_months: {
      type: Number,
      required: [true, "Number of months is required"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount must be at least zero"],
      max: [100, ""],
    },
    tenant_id: {
      type: Schema.ObjectId,
      ref: "School",
      required: [true, "School is required"],
    },
  },
  {
    writeConcern: { w: "majority", j: true },
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Packages model
const PmtPackage = mongoose.model<IPmtPackageDoc>("PmtPackage", pmtPacksSchema);

// Export the model
export default PmtPackage;
