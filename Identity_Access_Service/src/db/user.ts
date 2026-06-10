import { pgTable, varchar, date, serial, index } from "drizzle-orm/pg-core";
import { RoleEnum   , GenderEnum } from "./enum";

export const user = pgTable('users', {
    userId: serial('id').primaryKey(),
    
    //Name fields
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    middleName: varchar('middle_name', { length: 255 }),

    birthDate: date('birth_date').notNull(),
    gender: GenderEnum('gender').notNull(),
    
    // Contact Information
    email: varchar('email', { length: 255 }).notNull().unique(),
    contactNumber: varchar('contact_number', { length: 20 }).notNull(),

    // Credential Information
    username: varchar('username', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),

    // Address Information
    houseNumber: varchar('house_number', { length: 255 }).notNull(),
    street: varchar('street', { length: 255 }).notNull(),
    barangay: varchar('barangay', { length: 255 }).notNull(),
    cityMunicipality: varchar('city_municipality', { length: 255 }).notNull(),
    region: varchar('region', { length: 255 }).notNull(),
    province: varchar('province', { length: 255 }).notNull(),

    role: RoleEnum('role').notNull()
},
    (table) => [
        index('idx_person_email').on(table.email),
        index('idx_person_username').on(table.username)
    ]
);



