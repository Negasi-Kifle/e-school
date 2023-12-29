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
  static async getUserById(
    _id: string,
    tenant_id?: string
  ): Promise<IUsersDoc | null> {
    try {
      if (tenant_id) {
        const user = await User.findOne({ _id, tenant_id });
        return user;
      } else {
        const user = await User.findById(_id);
        return user;
      }
    } catch (error) {
      throw error;
    }
  }

  // Get owner by id
  static async getOwnerById(id: string): Promise<IUsersDoc | null> {
    try {
      const owner = await User.findOne({ _id: id, role: "Owner" });
      return owner;
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

  // Delete owner by id
  static async deleteOwnerById(id: string): Promise<IUsersDoc | any> {
    try {
      const deletedUser = await User.deleteOne({ id, role: "Owner" });
      return deletedUser;
    } catch (error) {
      throw error;
    }
  }

  // Delete user by id
  static async deleteUserById(
    _id: string,
    tenant_id: string
  ): Promise<IUsersDoc | any> {
    try {
      const deletedUser = await User.deleteOne({
        _id,
        tenant_id,
        role: { $ne: "Owner" },
      });
      return deletedUser;
    } catch (error) {
      throw error;
    }
  }

  // Delete all users in DB
  static async deleteAllUsers(role?: string) {
    try {
      if (role) {
        await User.deleteMany({ role });
      } else {
        await User.deleteMany();
      }
    } catch (error) {
      throw error;
    }
  }

  // Get user by phone number and status active
  static async getActiveUserByPhoneNum(
    phone_num: string
  ): Promise<IUsersDoc | null> {
    try {
      const user = await User.findOne({ phone_num, status: "Active" });
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

  // Delete users in tenant
  static async deleteTenantUsers(tenant_id: string) {
    try {
      await User.deleteMany({ tenant_id });
    } catch (error) {
      throw error;
    }
  }

  // Get all users of a tenant
  static async getTenantUsers(tenant_id: string): Promise<IUsersDoc[]> {
    try {
      const tenantUsers = await User.find({ tenant_id });
      return tenantUsers;
    } catch (error) {
      throw error;
    }
  }

  // Reset user password
  static async resetPassword(
    user: IUsersDoc,
    password: string
  ): Promise<IUsersDoc> {
    try {
      user.password = password;
      user.is_default_pswd = true;
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Update user status (user in a tenant)
  static async updateUserStatus(
    data: UserRequests.IUpdateUserStatus
  ): Promise<IUsersDoc | null> {
    try {
      const user = await User.findOneAndUpdate(
        { _id: data.user_id, tenant_id: data.tenant_id },
        { status: data.status },
        { runValidators: true, new: true }
      );
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Update owner status
  static async updateOwnerStatus(
    data: UserRequests.IUpdateOwnerStatus
  ): Promise<IUsersDoc | null> {
    try {
      const owner = await User.findOneAndUpdate(
        {
          _id: data.owner_id,
        },
        { status: data.status },
        { runValidators: true, new: true }
      );
      return owner;
    } catch (error) {
      throw error;
    }
  }
}
