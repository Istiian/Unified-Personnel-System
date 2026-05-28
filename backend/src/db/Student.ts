import { integer, pgTable, varchar, date, serial } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import {  StudentStatus, StudentType } from "./Enum";
import { courses } from "./Course";

export const students = pgTable('students', {
    id: serial('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => persons.id, {onDelete: 'cascade'}).unique(),
    enrollmentDate: date('enrollment_date').notNull(),
    courseId: integer('course_id').notNull().references(() => courses.id),
    status: StudentStatus('status').notNull().default('active'),
    section: varchar('section', { length: 50 }).notNull(),
    studentType: StudentType('student_type').notNull().default('regular'),
});





