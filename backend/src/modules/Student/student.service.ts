import { students } from "../../db/Student"
import { db } from "../../db/client";
import { persons } from "../../db/schema";
import { AppError } from "../../middleware/app-error";
import { recordPersonalInfo } from "../Person/person.service";
import { checkRepeatPassword, checkUserExists, hashPassword } from "../common.utils";
import { Student, studentStatus, studentType } from "./student.type";
import { and, eq, ilike } from "drizzle-orm";


type StudentFilter = {
    status?: studentStatus;
    role?: string;
    courseId?: number;
    section?: string;
    studentType?: studentType;
    // add other attributes as needed
};

export const getStudents = async ( page: number, limit: number, filter: StudentFilter = {} ) => {
    const offset = (page - 1) * limit;
    const studentWhereClause: any = []
    if(filter.status) studentWhereClause.push(eq(students.status, filter.status)) 
    if(filter.section) studentWhereClause.push(eq(students.section, filter.section))
    if(filter.studentType) studentWhereClause.push(eq(students.studentType, filter.studentType))
    if(filter.courseId) studentWhereClause.push(eq(students.courseId, filter.courseId))

    try {
        return await db.query.students.findMany({
            where: and(...studentWhereClause),
            with: {
                person: true,
                course: {columns: { name: true } }
            },
            limit,
            offset
        });

    } catch (error) {
        console.error('Error fetching students:', error);
        throw error instanceof AppError ? error : new AppError('Failed to fetch students', 500);
    }
};


export const registerStudent = async (studentData: Student) => {
    try {
        const hashedPassword = await hashPassword(studentData.personalData.password);

        if (await checkUserExists(studentData.personalData.email)) {
            throw new AppError("User with this email already exists", 400);
        }

        if (checkRepeatPassword(studentData.personalData.password, studentData.personalData.repeatPassword || "")) {
            throw new AppError("Passwords do not match", 400);
        }

        const data = await db.transaction(async (trx) => {
            const [person] = await trx.insert(persons).values({
                firstName: studentData.personalData.firstName,
                lastName: studentData.personalData.lastName,
                middleName: studentData.personalData.middleName,
                birthDate: studentData.personalData.birthDate,
                contactNumber: studentData.personalData.contactNumber,
                email: studentData.personalData.email,
                password: hashedPassword,
                houseNumber: studentData.personalData.address.houseNumber,
                street: studentData.personalData.address.street,
                barangay: studentData.personalData.address.barangay,
                cityMunicipality: studentData.personalData.address.cityMunicipality,
                region: studentData.personalData.address.region,
                province: studentData.personalData.address.province,
                role: "student"
            }).returning();

            const [student] = await trx.insert(students).values({
                personId: person.personId,
                enrollmentDate: studentData.studentData.enrollmentDate,
                courseId: studentData.studentData.courseId,
                status: studentData.studentData.status,
                section: studentData.studentData.section,
                studentType: studentData.studentData.studentType
            }).returning();

            return { person, student };
        });

        return data;
    } catch (error) {
        console.error('Error registering student:', error);
        throw error instanceof AppError ? error : new AppError('Failed to register student', 500);
    }
}

export const updateStudentInfo = async (studentId: number, studentData: Partial<Student>, trx?: any) => {
    try {
        const personId = await db.query.students.findFirst({
            where: eq(students.studentId, studentId),
            columns: { personId: true }
        });

        if (!personId) {
            throw new AppError("Student not found", 404);
        }

        const updatedInfo = await db.transaction(async (trx) => {
            const [updatedPersonalInfo] = await trx.update(persons)
                .set((studentData).personalData || {})
                .where(eq(persons.personId, personId.personId))
                .returning();

            const [updatedStudentInfo] = await trx.update(students)
                .set((studentData).studentData || {})
                .where(eq(students.personId, personId.personId))
                .returning();

            return { updatedPersonalInfo, updatedStudentInfo };
        });

        return updatedInfo;
    } catch (error) {
        console.error('Error updating student info:', error);
        throw error instanceof AppError ? error : new AppError('Failed to update student', 500);
    }
}

export const deleteStudentInfo = async (studentId: number, trx?: any) => {
    try {
        const personId = await db.query.students.findFirst({
            where: eq(students.studentId, studentId),
            columns: { personId: true }
        });

        if (!personId) {
            throw new AppError("Student not found", 404);
        }

        const deletedData = await db.transaction(async (trx) => {
            const deletedPerson = await trx.delete(persons)
                .where(eq(persons.personId, personId.personId))
                .returning();

            const deletedStudent = await trx.delete(students)
                .where(eq(students.personId, personId.personId))
                .returning();

            return { deletedPerson, deletedStudent };
        });

        return deletedData;
    } catch (error) {
        console.error('Error deleting student:', error);
        throw error instanceof AppError ? error : new AppError('Failed to delete student', 500);
    }
}
