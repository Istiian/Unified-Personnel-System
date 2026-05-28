import { integer, pgTable, date, serial } from "drizzle-orm/pg-core";
import { persons } from "./Person";
import {courses} from "./Course";
import { EmployeeStatus, EmployeeType } from "./Enum";

export const programChairs = pgTable('program_chairs', {
    id: serial('id').primaryKey(),
    personId: integer('person_id').notNull().references(() => persons.id, {onDelete: 'cascade'}).unique(),
    courseId: integer('course_id').notNull().references(() => courses.id),
    startDate: date('start_date').notNull(),
    status: EmployeeStatus('status').notNull().default('active'),
    type: EmployeeType('type').notNull()
});





