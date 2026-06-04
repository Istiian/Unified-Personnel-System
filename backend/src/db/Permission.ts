import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const permissions = pgTable('permissions', {
    permissionId: serial('id').primaryKey(),
    name: varchar('name').notNull().unique(),
});

