import mongoose, { Schema } from "mongoose";
import ParentDoc from "./dto";
import bcrypt from "bcryptjs";
import IParentDoc from "./dto";

const parentSchema: Schema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
      maxlength: [100, "First name can not exceed 100 characters"],
      minlength: [1, "First name can not be less than 1 character"],
    },
    last_name: {
      type: String,
      required: [true, "Last name is required"],
      maxlength: [100, "Last name can not exceed 100 characters"],
      minlength: [1, "Last name can not be less than 1 character"],
    },
    phone_number: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      maxlength: [20, "Phone number can not exceed 20 characters"],
      minlength: [10, "Phone number can not be less than 10 characters"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      maxlength: [20, "Address can not exceed 20 characters"],
      minlength: [10, "Address can not be less than 10 characters"],
    },
    is_default_password: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password can not be less than 8 characters"],
    },
    password_changed_at: Date,
    is_credential_changed: {
      type: Boolean,
      default: false,
    },
    phone_number_changed_at: {
      type: Boolean,
      default: false,
    },
    account_status: {
      type: String,
      default: "Active",
      enum: {
        values: ["Active", "Inactive"],
        message: "Invalid or unknown account status",
      },
    },
    profile_img:{
      secure_url:{
        type: String,
        required:[ true, "Image is required"]
      },
      public_id:{
        type: String,
        required:[ true, "Image is required"]
      }
    },
    role: {
      type: String,
      default:"Parent"
    },
    otp: String,
    otp_expiry: Date,
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

parentSchema.virtual("full_name").get(function (this: IParentDoc) {
  return `${this.first_name} ${this.last_name}`;
});

// Hash password
parentSchema.pre("save", function (this: IParentDoc, next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 12);
  next();
});

// Add Password Changed at timestamp
parentSchema.pre("save", function (this: IParentDoc, next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.password_changed_at = new Date(Date.now());
  next();
});

// Compare password
parentSchema.methods.comparePassword = function (
  candidatePassword: string,
  password: string
): boolean {
  return bcrypt.compareSync(candidatePassword, password);
};

// Check password changed at
parentSchema.methods.checkPasswordChangedAt = function (
  this: ParentDoc,
  iat: number
): boolean {
  if (this.password_changed_at) {
    return iat < Math.round(this.password_changed_at.getTime() / 1000);
  }
  return false;
};

const ParentModel = mongoose.model<IParentDoc>("Parent", parentSchema);

export default ParentModel;
