import { pgTable, varchar, date, serial, index, integer } from "drizzle-orm/pg-core";
import { personRole } from "./Enum";
import {roles} from "./Roles";

export const persons = pgTable('persons', {
    personId: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    middleName: varchar('middle_name', { length: 255 }),
    birthDate: date('birth_date').notNull(),
    contactNumber: varchar('contact_number', { length: 20 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    username: varchar('username', { length: 255 }).notNull().unique().default(""),
    password: varchar('password', { length: 255 }).notNull(),
    houseNumber: varchar('house_number', { length: 255 }).notNull(),
    street: varchar('street', { length: 255 }).notNull(),
    barangay: varchar('barangay', { length: 255 }).notNull(),
    cityMunicipality: varchar('city_municipality', { length: 255 }).notNull(),
    region: varchar('region', { length: 255 }).notNull(),
    province: varchar('province', { length: 255 }).notNull(),
    role: integer('role').notNull().references(() => roles.roleId)
},
    (table) => [
        index('idx_person_email').on(table.email),
        index('idx_person_username').on(table.username)
    ]
);



