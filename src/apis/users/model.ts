import mongoose, { Schema } from "mongoose";
import IUsersDoc from "./dto";
import bcrypt from "bcryptjs";

// Users schema
const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
    },
    last_name: {
      type: String,
      required: [true, "Last name is reqiured"],
    },
    phone_num: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
    },
    status: {
      type: String,
      default: "Active",
      enum: {
        values: ["Active", "Inactive"],
        message: "Invalid status selected",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    is_default_pswd: {
      type: Boolean,
      default: true,
    },
    is_credential_changed: {
      type: Boolean,
      default: false,
    },
    tenant_id: String,
    address: {
      type: String,
      required: [true, "Address is requried"],
    },
    prof_img: {
      secure_url: {
        type: String,
        required: [true, "Secure Url of profile picture is required"],
      },
      public_id: {
        type: String,
        required: [true, "Public Id of profile picture is required"],
      },
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

// Pre save hook
userSchema.pre("save", function (this: IUsersDoc, next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 12);
  next();
});

// Users model
const User = mongoose.model<IUsersDoc>("User", userSchema);

// Export users model
export default User;
