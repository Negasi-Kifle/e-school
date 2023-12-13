import SchoolModel from "./model";
import ISchoolDoc from "./dto";
import APIFeatures from "../../utils/api_features";

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


  // Get all schools
  static async getAllSchools(query?: RequestQuery): Promise<ISchoolDoc[]> {
    try {
      // const schools = await SchoolModel.find();
      const apiFeature = new APIFeatures<ISchoolDoc>(SchoolModel.find(), query)
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
  static async getSchoolByName(school_name: string): Promise<ISchoolDoc | null> {
    try {
      const school = await SchoolModel.findOne({school_name});
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

  // Delete a school permaently
  static async deleteSchool(id: string): Promise<ISchoolDoc | null> {
    try {
      const school = await SchoolModel.findByIdAndDelete(id);
      return school.value;
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
