CREATE TABLE "permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" integer NOT NULL,
	CONSTRAINT "permissions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "permission_roles" (
	"permission_id" integer NOT NULL,
	"role_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" integer NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
INSERT INTO "roles" ("id", "name") VALUES
	(1, 1),
	(2, 2),
	(3, 3),
	(4, 4),
	(5, 5),
	(6, 6)
ON CONFLICT ("id") DO NOTHING;--> statement-breakpoint
ALTER TABLE "persons" ALTER COLUMN "role" SET DATA TYPE integer USING (
	CASE "role"::text
		WHEN 'student' THEN 1
		WHEN 'faculty' THEN 2
		WHEN 'admin' THEN 3
		WHEN 'dean' THEN 4
		WHEN 'programChair' THEN 5
		WHEN 'staff' THEN 6
	END
);--> statement-breakpoint
ALTER TABLE "permission_roles" ADD CONSTRAINT "permission_roles_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permission_roles" ADD CONSTRAINT "permission_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "persons" ADD CONSTRAINT "persons_role_roles_id_fk" FOREIGN KEY ("role") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;