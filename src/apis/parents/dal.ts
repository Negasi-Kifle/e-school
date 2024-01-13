import ParentModel from "./model";
import IParentDoc from "./dto";
import APIFeatures from "../../utils/api_features";
import IStudentDoc from "../students/dto";
import Student from "../students/model";
import bcrypt from "bcryptjs";

export default class Parent {
  // Create an parent
  static async createParent(
    data: ParentRequest.ICreateParentInput
  ): Promise<IParentDoc> {
    try {
      const newParent = await ParentModel.create({
        first_name: data.first_name,
        last_name: data.last_name,
        address: data.address,
        phone_number: data.phone_number,
        password: data.password,
        profile_img: data.profile_img,
      });

      return newParent;
    } catch (error) {
      throw error;
    }
  }

  // Parent login
  static async getParentByPhoneNumber(
    phone: string
  ): Promise<IParentDoc | null> {
    const parent = await ParentModel.findOne({ phone_number: phone });
    return parent;
  }

  // get by email
  static async getParentByEmail(
    email: string
  ): Promise<IParentDoc | null> {
    const parent = await ParentModel.findOne({ email});
    return parent;
  }

  // get by email
  static async getParentByOTP(
    otp: string
  ): Promise<IParentDoc | null> {
    const parent = await ParentModel.findOne({ otp});
    return parent;
  }

  // Get all parents
  static async getAllParents(query?: RequestQuery): Promise<IParentDoc[]> {
    try {
      // const parents = await ParentModel.find();
      const apiFeature = new APIFeatures<IParentDoc>(ParentModel.find(), query)
        .filter()
        .sort()
        .project();
      const parents = await apiFeature.dbQuery;
      return parents;
    } catch (error) {
      throw error;
    }
  }

  // Get an parent
  static async getParent(id: string): Promise<IParentDoc | null> {
    try {
      const parent = await ParentModel.findById(id);
      return parent;
    } catch (error) {
      throw error;
    }
  }

  // Update default password
  static async updateDefaultPassword(
    parent: IParentDoc,
    password: string
  ): Promise<IParentDoc> {
    try {
      parent.password = password;
      parent.is_default_password = false;
      await parent.save();

      return parent;
    } catch (error) {
      throw error;
    }
  }

  static async comparePassword(candidatePassword: string, password: string){
    return bcrypt.compareSync(candidatePassword, password);
  }

  // Update email or phone number
  static async updatePhoneNumber(
    id: string,
    phone_number_changed_at: boolean,
    phone_number: string
  ): Promise<IParentDoc | null> {
    try {
      let parent: IParentDoc | null;
      if (phone_number_changed_at) {
        parent = await ParentModel.findByIdAndUpdate(
          id,
          {
            phone_number,
          },
          { runValidators: true, new: true }
        );
      } else {
        parent = await ParentModel.findByIdAndUpdate(id, {
          phone_number,
        });
      }
      return parent;
    } catch (error) {
      throw error;
    }
  }

  // Update email_phone_number changed at to false
  static async updatePhoneNumberChangedAt(
    id: string
  ): Promise<IParentDoc | null> {
    try {
      const parent = await ParentModel.findByIdAndUpdate(
        id,
        { phone_number_changed_at: false },
        { runValidators: true, new: true }
      );
      return parent;
    } catch (error) {
      throw error;
    }
  }

  // Update parent password
  static async updateParentPassword(
    parent: IParentDoc,
    password: string
  ): Promise<IParentDoc | null> {
    try {
      parent.password = password;
      parent.is_credential_changed = true;
      await parent.save();

      return parent;
    } catch (error) {
      throw error;
    }
  }

  // Reset parent password
  static async resetParentPassword(
    parent: IParentDoc,
    default_password: string
  ): Promise<IParentDoc> {
    try {
      // Update
      parent.password = default_password;
      parent.is_default_password = true;
      await parent.save();

      return parent;
    } catch (error) {
      throw error;
    }
  }

  // change parent password
  static async updateForgottenPswd(
    parent: IParentDoc,
    default_password: string
  ): Promise<IParentDoc> {
    try {
      // Update
      parent.password = default_password;
      await parent.save();

      return parent;
    } catch (error) {
      throw error;
    }
  }

  // Update parent account status
  static async updateParentAccountStatus(
    id: string,
    account_status: string
  ): Promise<IParentDoc | null> {
    try {
      const parent = await ParentModel.findByIdAndUpdate(
        id,
        { account_status },
        { runValidators: true, new: true }
      );
      return parent;
    } catch (error) {
      throw error;
    }
  }

    // Update "otp" and "otp_expiry"
    static async updateOTP(
      id: string,
      data: ParentRequest.IUpdateOTP
    ): Promise<IParentDoc | null> {
      try {
        const user = await ParentModel.findByIdAndUpdate(
          id,
          { otp: data.otp, otp_expiry: data.otp_expiry },
          {
            runValidators: true,
            new: true,
          }
        );
        return user;
      } catch (error) {
        throw error;
      }
    }

  // Delete an parent permanently
  static async deleteParent(id: string): Promise<any | null> {
    try {
      const parent = await ParentModel.findByIdAndDelete(id);
      return parent;
    } catch (error) {
      throw error;
    }
  }

  // Delete all parents
  static async deleteAllParents() {
    try {
      await ParentModel.deleteMany({});
    } catch (error) {
      throw error;
    }
  }

  // Get students by parent
  static async getStudentsOfParent(parent: string): Promise<IStudentDoc[]> {
    try {
      const students = await Student.find({ parent });
      return students;
    } catch (error) {
      throw error;
    }
  }
}
