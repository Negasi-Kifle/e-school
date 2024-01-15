import SchoolModel from "./model";
import ISchoolDoc from "./dto";
import APIFeatures from "../../utils/api_features";
import IUsersDoc from "../users/dto";

export default class School {
  // Create a school
  static async createSchool(
    data: SchoolRequest.ICreateSchoolInput
  ): Promise<ISchoolDoc> {
    try {
      const school = await SchoolModel.create(data);
      return school;
    } catch (error) {
      throw error;
    }
  }

  // Update a school
  static async updateSchool(
    data: SchoolRequest.IUpdateSchoolInput,
    id: string
  ): Promise<ISchoolDoc | null> {
    try {
      const school = await SchoolModel.findByIdAndUpdate(id, data);
      return school;
    } catch (error) {
      throw error;
    }
  }
  // Update a school status
  static async updateSchoolStatus(
    data: SchoolRequest.IUpdateStatus,
    id: string
  ): Promise<ISchoolDoc | null> {
    try {
      const school = await SchoolModel.findByIdAndUpdate(id, data, {
        runValidators: true,
        new: true,
      });
      return school;
    } catch (error) {
      throw error;
    }
  }

  // Get all schools
  static async getAllSchools(query?: RequestQuery): Promise<ISchoolDoc[]> {
    try {
      // const schools = await SchoolModel.find();
      const apiFeature = new APIFeatures<ISchoolDoc>(
        SchoolModel.find().populate({
          path: "owner",
          select: "first_name last_name phone_num",
        }),
        query
      )
        .filter()
        .sort()
        .project();

      const schools = await apiFeature.dbQuery;
      return schools;
    } catch (error) {
      throw error;
    }
  }

  // Get a school
  static async getSchoolByName(
    school_name: string
  ): Promise<ISchoolDoc | null> {
    try {
      const school = await SchoolModel.findOne({ school_name });
      return school;
    } catch (error) {
      throw error;
    }
  }

  // Get a school
  static async getSchool(id: string): Promise<ISchoolDoc | null> {
    try {
      const school = await SchoolModel.findById(id);
      return school;
    } catch (error) {
      throw error;
    }
  }

  // Get a school by owner id
  static async getSchoolsByOwner(id: string): Promise<ISchoolDoc[]> {
    try {
      const school = await SchoolModel.find({ owner: id }).populate({
        path: "owner",
        select: "first_name last_name phone_num",
      });
      return school;
    } catch (error) {
      throw error;
    }
  }

  // Delete a school permaently
  static async deleteSchool(id: string): Promise<any> {
    try {
      const school = await SchoolModel.findByIdAndDelete(id);
      return school;
    } catch (error) {
      throw error;
    }
  }

  // Delete all schools
  static async deleteAllSchools() {
    try {
      await SchoolModel.deleteMany({});
    } catch (error) {
      throw error;
    }
  }
}
