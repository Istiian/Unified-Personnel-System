import { varchar, pgTable, serial } from 'drizzle-orm/pg-core';

export const roles = pgTable('roles', {
    roleId: serial('id').primaryKey(),
    name: varchar('name').notNull().unique(),
});
