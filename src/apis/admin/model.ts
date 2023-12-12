import mongoose, { Schema } from "mongoose";
import validator from "validator";
import AdminDoc from "./dto";
import bcrypt from "bcryptjs";
import IAdminDoc from "./dto";

const adminSchema: Schema = new Schema(
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
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: () => {
          validator.isEmail;
        },
        message: "Invalid email address",
      },
    },
    phone_number: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      maxlength: [20, "Phone number can not exceed 20 characters"],
      minlength: [10, "Phone number can not be less than 10 characters"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["Owner", "Super-admin", "Admin"],
        message: "Invalid admin role",
      },
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
    password_confirm: {
      type: String,
      required: [true, "Password confirm is required"],
      validate: {
        validator: function (this: IAdminDoc, value: string) {
          return value === this.password;
        },
      },
    },
    first_account: {
      type: Boolean,
      default: false,
    },
    password_changed_at: Date,
    email_phone_number_changed_at: {
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

adminSchema.virtual("full_name").get(function (this: IAdminDoc) {
  return `${this.first_name} ${this.last_name}`;
});

// Hash password
adminSchema.pre("save", function (this: IAdminDoc, next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 12);
  this.password_confirm = undefined;
  next();
});

// Add Password Changed at timestamp
adminSchema.pre("save", function (this: IAdminDoc, next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.password_changed_at = new Date(Date.now());
  next();
});

// Compare password
adminSchema.methods.comparePassword = function (
  candidatePassword: string,
  password: string
): boolean {
  return bcrypt.compareSync(candidatePassword, password);
};

// Check password changed at
adminSchema.methods.checkPasswordChangedAt = function (
  this: AdminDoc,
  iat: number
): boolean {
  if (this.password_changed_at) {
    return iat < Math.round(this.password_changed_at.getTime() / 1000);
  }
  return false;
};

const AdminModel = mongoose.model<IAdminDoc>("Admin", adminSchema);

export default AdminModel;
