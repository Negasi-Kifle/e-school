import AppError from "../../../utils/app_error";
import PCOST from "../../pcost/dal";
import StudentDAL from "../../students/dal";
import IStudentDoc from "../../students/dto";
import IPCODoc from "../dto";

/**
 * Creates PCOSts
 * @param data - an object with array of "levels", array of "grades", "pco" fields
 */
export default async function createPcosts(
  data: PCORequests.ICreatePcosts
): Promise<void> {
  try {
    // Check levels and grades
    if (
      data.grades.length >= 1 && data.grades[0] !== "All"
    ) {
      // Get all students for the selected grades
      const students = await manyGrades(
        data.grades,
        data.tenant_id
      );

      // Create all PCOSts for the students
      await createAllPcosts(students, data.pco);
    } else if (data.grades.length === 1 && data.grades[0] === "All") {
      // Get all students for the selected grades
      const students = await allGrades(data.tenant_id);

      // Create all PCOSts for the students
      await createAllPcosts(students, data.pco);
    }
    // else if (
    //   data.levels.length >= 1 &&
    //   !data.levels.includes("All") &&
    //   data.grades.length >= 1 &&
    //   !data.grades.includes("All")
    // ) {
    //   // Get all students for the selected levels and grades
    //   const students = await multiLevelsAndMultiGrades(
    //     data.levels,
    //     data.grades,
    //     data.tenant_id
    //   );

    //   // Create all PCOSts for the students
    //   await createAllPcosts(students, data.pco);
    // }
    //  else {
    //   throw new AppError("Unable to create PCOSts", 400);
    // }
  } catch (error) {
    throw error;
  }
}

// Get students when multiple grades are selected
export async function manyGrades(
  grades: string[],
  tenant_id: string
): Promise<IStudentDoc[]> {
  try {
    // Store students temporarily
    const students: IStudentDoc[] = [];


    // Loop through each grade and fetch students in each grade
    for (let grade of grades) {
      const student = await StudentDAL.getByGradeInTenant(
        grade,
        tenant_id
      );
      students.push(...student);
    }

    return students;
  } catch (error) {
    throw error;
  }
}

// Get students when all levels and grades are selected
export async function allGrades(
  tenant_id: string
): Promise<IStudentDoc[]> {
  try {
    // Temporary array to store students docs
    const students: IStudentDoc[] = [];

    // Number of students
    const numOfStudents = await StudentDAL.countTenantStudents(tenant_id);
    const batchSize = 10;

    
    // Fetch students by batch and add them to the temporary array
    for (let i = 0; i < numOfStudents; i += batchSize) {
      const studentsInTenant = await StudentDAL.getStudentsInTenant(tenant_id, {
        page: i / batchSize + 1,
        limit: batchSize,
      });
      students.push(...studentsInTenant);
    }
    return students;
  } catch (error) {
    throw new Error(`Failed to fetch students: ${error}`);
  }
}

// Get students when multiple levels and multiple grades are selected
// export async function multiLevelsAndMultiGrades(
//   levels: string[],
//   grades: string[],
//   tenant_id: string
// ): Promise<IStudentDoc[]> {
//   try {
//     // Temporary array to store students
//     const students: IStudentDoc[] = [];

//     // Fetch students in each level and grade
//     for (let level of levels) {
//       for (let grade of grades) {
//         const studentsInDb = await StudentDAL.getByLevelAndGradeInTenant(
//           level,
//           grade,
//           tenant_id
//         );
//         students.push(...studentsInDb);
//       }
//     }

//     return students;
//   } catch (error) {
//     throw error;
//   }
// }

// Create PCOSts
export async function createAllPcosts(
  students: IStudentDoc[],
  pco: string
): Promise<string> {
  try {
    // Loop through students document and create the PCOSts
    for (let student of students) {
      // Construct the objec data neccessary for creating PCOSt
      const data = <PCOSTRequest.ICreatePCOSTInput>{
        pco: pco,
        student: student.id,
        parent: student.parent,
      };

      // Create PCOSt document
      await PCOST.createPCOST(data);
    }

    // Return success message
    return "PCOSts created successfully";
  } catch (error) {
    throw error;
  }
}

// Get grades by grade
export function getGrades(grade: string[]) {
  try {
    if (grade[0] === "All") {
      return [
        "KG 1",
        "KG 2",
        "KG 3",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
      ];
    } else {
      throw new AppError("Grade not recognized", 400);
    }
  } catch (error) {
    throw error;
  }
}
