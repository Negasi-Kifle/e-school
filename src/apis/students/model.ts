import mongoose, { Schema } from "mongoose";
import IStudentDoc from "./dto";

// Schema for students model
const studentsSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
    },
    last_name: {
      type: String,
      required: [true, "Last name is required"],
    },
    level: {
      type: String,
      required: [true, "Education level is required"],
      enum: {
        values: ["KG", "Elementary", "High School", "Preparatory"],
        message:
          "Level must be one of: KG, Elementary, High School, Preparatory",
      },
    },
    grade: {
      type: String,
      required: [true, "What grade is the student in?"],
      enum: {
        values: [
          "KG 1",
          "KG 2",
          "KG 3",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
        ],
      },
    },
    sex: {
      type: String,
      required: [true, "Sex is required"],
      enum: {
        values: ["Male", "Female"],
        message: "Sex must be Male or Female",
      },
    },
    parent: String,
    parent_relation: String,
    tenant_id: {
      type: Schema.ObjectId,
      ref: "School",
      required: [true, "Please select school"],
    },
    prof_img: {
      secure_url: String,
      public_id: String,
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

// Student model
const Student = mongoose.model<IStudentDoc>("Student", studentsSchema);

// Export the model
export default Student;
