import { relations } from 'drizzle-orm';
import { persons } from './Person';
import { admins } from './Admin';
import { deans } from './Dean';
import { faculty } from './Faculty';
import { programChairs } from './Program_Chair';
import { staff } from './Staff';
import { students } from './Student';
import { offices } from './Office';
import { courses } from './Course';
import { departments } from './Department';

export const personsRelations = relations(persons, ({ one }) => ({
  admin: one(admins,{
    fields: [persons.id], 
    references: [admins.personId]
  }),
  dean: one(deans,{
    fields: [persons.id], 
    references: [deans.personId]
  }),
  faculty: one(faculty,{
    fields: [persons.id], 
    references: [faculty.personId]
  }),
  programChair: one(programChairs,{
    fields: [persons.id], 
    references: [programChairs.personId]
  }),
  staff: one(staff,{
    fields: [persons.id], 
    references: [staff.personId]
  }),
  student: one(students,{
    fields: [persons.id], 
    references: [students.personId]
  }),
}));

export const adminsRelations = relations(admins, ({ one }) => ({
  person: one(persons, {
    fields: [admins.personId], 
    references: [persons.id]
  }),
  office: one(offices),
}));

export const deansRelations = relations(deans, ({ one }) => ({
  person: one(persons, {
    fields: [deans.personId], 
    references: [persons.id]
  }),
  department: one(departments),
}));

export const facultyRelations = relations(faculty, ({ one }) => ({
  person: one(persons, {
    fields: [faculty.personId], 
    references: [persons.id]
  }),
  department: one(departments),
}));

export const programChairsRelations = relations(programChairs, ({ one }) => ({
  person: one(persons, {
    fields: [programChairs.personId], 
    references: [persons.id]
  }),
  course: one(courses,{
    fields: [programChairs.courseId], 
    references: [courses.id]
  }),
}));

export const staffRelations = relations(staff, ({ one, many }) => ({
  person: one(persons, {
    fields: [staff.personId], 
    references: [persons.id]
  }),
  office: many(offices),
}));

export const studentsRelations = relations(students, ({ one }) => ({
  person: one(persons, {
    fields: [students.personId], 
    references: [persons.id]
  }),
  course: one(courses, {
    fields: [students.courseId], 
    references: [courses.id]
  }),
}));

export const officesRelations = relations(offices, ({ many }) => ({
  admins: many(admins),
  staff: many(staff),
}));

export const coursesRelations = relations(courses, ({ one }) => ({
  department: one(departments,{
    fields: [courses.departmentId], 
    references: [departments.id]
  }),
}));

export const departmentsRelations = relations(departments, ({ many }) => ({
  deans: many(deans),
  faculty: many(faculty),
  courses: many(courses),
}));
