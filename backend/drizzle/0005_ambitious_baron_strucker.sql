ALTER TABLE "admins" DROP CONSTRAINT "admins_person_id_persons_id_fk";
--> statement-breakpoint
ALTER TABLE "deans" DROP CONSTRAINT "deans_person_id_persons_id_fk";
--> statement-breakpoint
ALTER TABLE "faculty" DROP CONSTRAINT "faculty_person_id_persons_id_fk";
--> statement-breakpoint
ALTER TABLE "program_chairs" DROP CONSTRAINT "program_chairs_person_id_persons_id_fk";
--> statement-breakpoint
ALTER TABLE "staff" DROP CONSTRAINT "staff_person_id_persons_id_fk";
--> statement-breakpoint
ALTER TABLE "students" DROP CONSTRAINT "students_person_id_persons_id_fk";
--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deans" ADD CONSTRAINT "deans_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_chairs" ADD CONSTRAINT "program_chairs_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;