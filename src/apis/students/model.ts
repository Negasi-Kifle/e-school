import mongoose, { Schema } from "mongoose";
import IStudentDoc from "./dto";

// Schema for students model
const studentsSchema = new Schema({
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
  },
  sex: {
    type: String,
    required: [true, "Sex is required"],
    enum: {
      values: ["Male", "Femal"],
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
});

// Student model
const Student = mongoose.model<IStudentDoc>("Student", studentsSchema);

// Export the model
export default Student;
