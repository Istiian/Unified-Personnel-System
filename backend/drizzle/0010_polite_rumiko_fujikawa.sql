ALTER TABLE "persons" ALTER COLUMN "username" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "persons" ALTER COLUMN "password" DROP DEFAULT;--> statement-breakpoint
CREATE INDEX "idx_person_email" ON "persons" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_person_username" ON "persons" USING btree ("username");--> statement-breakpoint
ALTER TABLE "persons" ADD CONSTRAINT "persons_email_unique" UNIQUE("email");