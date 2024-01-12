import APIFeatures from "../../utils/api_features";
import IStudentDoc from "./dto";
import Student from "./model";

/**
 * Data access layer for student related data
 */
export default class StudentDAL {
  // Create student data
  static async createStudent(
    data: StudentRequests.ICreateStudent
  ): Promise<IStudentDoc> {
    try {
      const student = await Student.create(data);
      return student;
    } catch (error) {
      throw error;
    }
  }

  // Get all students in a tenant
  static async getStudentsInTenant(
    tenant_id: string,
    query?: RequestQuery
  ): Promise<IStudentDoc[]> {
    try {
      const apiFeatures = new APIFeatures(Student.find({ tenant_id }), query)
        .project()
        .filter()
        .sort()
        .paginate();

      const students = await apiFeatures.dbQuery;
      return students;
    } catch (error) {
      throw error;
    }
  }

  // Get all students in DB
  static async getAllStudentsInDB(
    query?: RequestQuery
  ): Promise<IStudentDoc[]> {
    try {
      const apiFeatures = new APIFeatures(Student.find(), query)
        .paginate()
        .project()
        .filter()
        .sort();

      const students = await apiFeatures.dbQuery;
      return students;
    } catch (error) {
      throw error;
    }
  }

  // Get student in tenant
  static async getStudentInTenant(
    studId: string,
    tenantId: string
  ): Promise<IStudentDoc | null> {
    try {
      const student = await Student.findOne({
        _id: studId,
        tenant_id: tenantId,
      });
      return student;
    } catch (error) {
      throw error;
    }
  }

  // Update student info
  static async updateStudent(
    id: string,
    data: StudentRequests.IUpdateStudent
  ): Promise<IStudentDoc | null> {
    try {
      const student = await Student.findByIdAndUpdate(id, data, {
        runValidators: true,
        new: true,
      });
      return student;
    } catch (error) {
      throw error;
    }
  }

  // Delete a student
  static async deleteStudent(studId: string): Promise<any> {
    try {
      const student = await Student.findByIdAndDelete(studId);
      return student;
    } catch (error) {
      throw error;
    }
  }

  // Delete all students in tenant
  static async deleteAllStudentsInTenant(tenant_id: string) {
    try {
      await Student.deleteMany({ tenant_id });
    } catch (error) {
      throw error;
    }
  }

  // Students by grade
  static async getByGradeInTenant(
    grade: string,
    tenant_id: string
  ): Promise<IStudentDoc[]> {
    try {
      const students = await Student.find({
        grade,
        tenant_id,
      });

      return students;
    } catch (error) {
      throw error;
    }
  }

  // Count students in a tenant
  static async countTenantStudents(tenant_id: string): Promise<number> {
    try {
      const students = await Student.countDocuments({ tenant_id });
      return students;
    } catch (error) {
      throw error;
    }
  }
}
