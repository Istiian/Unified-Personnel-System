import {integer, pgTable} from "drizzle-orm/pg-core";
import {permissions} from "./Permission";
import {roles} from "./Roles";

export const permissionRoles = pgTable('permission_roles', {
    permissionId: integer('permission_id').notNull().references(() => permissions.permissionId),
    roleId: integer('role_id').notNull().references(() => roles.roleId),
});