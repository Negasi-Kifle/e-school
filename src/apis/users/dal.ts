import User from "./model";
import IUsersDoc from "./dto";

/**
 * Data access layer for users-related data
 */
export default class UserDAL {
  // Create user
  static async createUser(data: UserRequests.ICreateInput): Promise<IUsersDoc> {
    try {
      const user = await User.create(data);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
