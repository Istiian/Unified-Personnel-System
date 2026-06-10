CREATE TYPE "public"."GenderEnum" AS ENUM('Male', 'Female', 'Other');--> statement-breakpoint
CREATE TYPE "public"."RoleEnum" AS ENUM('Student', 'Staff', 'Faculty', 'Admin');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"middle_name" varchar(255),
	"birth_date" date NOT NULL,
	"gender" "GenderEnum" NOT NULL,
	"email" varchar(255) NOT NULL,
	"contact_number" varchar(20) NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"house_number" varchar(255) NOT NULL,
	"street" varchar(255) NOT NULL,
	"barangay" varchar(255) NOT NULL,
	"city_municipality" varchar(255) NOT NULL,
	"region" varchar(255) NOT NULL,
	"province" varchar(255) NOT NULL,
	"role" "RoleEnum" NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE INDEX "idx_person_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_person_username" ON "users" USING btree ("username");