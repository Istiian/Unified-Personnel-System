import { pgTable, serial, varchar,  } from "drizzle-orm/pg-core";


export const departments = pgTable('departments', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
});

