import { students } from "../db/Student";
import { Student } from "./common.type";

export const recordStudentInfo = async (studentData: Student, trx?: any) => {
    try{
        const [student] = await trx.insert(students).values({
            personId: studentData.personId,
            enrollmentDate: studentData.enrollmentDate,
            courseId: studentData.courseId,
            status: studentData.status,
            section: studentData.section,
            studentType: studentData.studentType
        }).returning();

        return student;
    } catch (error) {
        console.error("Error recording student info:", error);
        throw error;
    }
}