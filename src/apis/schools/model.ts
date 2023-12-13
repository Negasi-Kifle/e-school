import mongoose, { Schema } from "mongoose";
import ISchoolDoc from "./dto";

const schoolSchema: Schema = new Schema(
  {
    school_name: {
      type: String,
      unique: true,
      required: [true, "School name is required"],
      maxlength: [500, "School name can not exceed 500 characters"],
      minlength: [1, "School name can not be less than 1 character"],
    },
    school_address: {
      type: String,
      required: [true, "School Address is required"],
      maxlength: [500, "School Address can not exceed 500 characters"],
      minlength: [1, "School Address can not be less than 1 character"],
    },
    license: {
      type: String,
      required: [true, "License is required"]
    },
    level: {
      type: String,
      required: [true, "School Level is required"],
      enum: {
        values: ["KG", "Elementary", "High-School", "Preparatory", "All"],
        message: "Invalid school level",
      },
    },
    status: {
      type: String,
      required: [true, "School Level is required"],
      enum: {
        values: ["Active", "Inactive"],
        message: "Invalid school status",
        default: "Active"
      },
    },
    owner: {
      type: String,
      required: [true, "Owner ID is required"],
    },
    license_file: {
      type: String,
    },
    license_file_public_id: {
      type: String,
    },
  },
  {
    writeConcern: {
      w: "majority",
      j: true,
    },
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);


const SchoolModel = mongoose.model<ISchoolDoc>("School", schoolSchema);

export default SchoolModel;
