import { integer, pgTable, serial, varchar} from "drizzle-orm/pg-core";

export const offices = pgTable('offices', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
});


