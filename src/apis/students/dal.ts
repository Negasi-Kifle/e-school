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
}
