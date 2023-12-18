import User from "./model";
import IUsersDoc from "./dto";
import APIFeatures from "../../utils/api_features";

/**
 * Data access layer for users-related data
 */
export default class UserDAL {
  // Create user
  static async createUser(
    data: UserRequests.ICreateOwnerInput
  ): Promise<IUsersDoc> {
    try {
      const user = await User.create(data);
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Get all owners
  static async getAllOwners(query?: RequestQuery): Promise<IUsersDoc[]> {
    try {
      const apiFeatures = new APIFeatures(User.find({ role: "Owner" }), query)
        .paginate()
        .filter()
        .project()
        .sort();

      const users = await apiFeatures.dbQuery;
      return users;
    } catch (error) {
      throw error;
    }
  }

  // Get all users in DB
  static async getAllUsers(query?: RequestQuery): Promise<IUsersDoc[]> {
    try {
      const apiFeatures = new APIFeatures(User.find(), query)
        .paginate()
        .project()
        .sort()
        .filter();

      const users = await apiFeatures.dbQuery;
      return users;
    } catch (error) {
      throw error;
    }
  }

  // Get user by id
  static async getUserById(id: string): Promise<IUsersDoc | null> {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Delete all user in DB
  static async deleteAllOwners() {
    try {
      await User.deleteMany({ role: "Owner" });
    } catch (error) {
      throw error;
    }
  }

  // Delete by id
  static async deleteById(id: string): Promise<any> {
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      return deletedUser;
    } catch (error) {
      throw error;
    }
  }

  // Get user by phone number
  static async getByPhoneNum(phone_num: string): Promise<IUsersDoc | null> {
    try {
      const user = await User.findOne({ phone_num });
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Update profile
  static async updateProfile(
    id: string,
    data: UserRequests.IUpdateProfile
  ): Promise<IUsersDoc | null> {
    try {
      const user = await User.findByIdAndUpdate(id, data, {
        runValidators: true,
        new: true,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Change password
  static async changePswd(
    password: string,
    user: IUsersDoc
  ): Promise<IUsersDoc | null> {
    try {
      user.password = password;
      user.is_default_pswd = false;
      user.is_credential_changed = true;
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }
}
