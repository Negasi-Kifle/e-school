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

  // Get all users
  static async getAllOwners(query?: RequestQuery): Promise<IUsersDoc[]> {
    try {
      const apiFeatures = new APIFeatures(User.find(), query)
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

  // Get user by id
  static async getOwnerById(id: string): Promise<IUsersDoc | null> {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Delete all user in DB
  static async deleteAll() {
    try {
      await User.deleteMany();
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
}
