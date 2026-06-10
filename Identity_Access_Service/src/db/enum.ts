import {pgEnum} from "drizzle-orm/pg-core";

export const RoleEnum = pgEnum("RoleEnum", [
    'Student',
    'Staff',
    'Faculty',
    'Admin',
    'SuperAdmin'
]);

export const GenderEnum = pgEnum("GenderEnum", [
    'Male',
    'Female',
    'Other'
])

