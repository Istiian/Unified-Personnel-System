CREATE TYPE "public"."office" AS ENUM('Registrar', 'Accounting', 'Human Resources', 'IT Support', 'Student Affairs', 'Faculty Affairs', 'Research and Development', 'Library Services', 'Facilities Management', 'Security', 'Finance', 'Admissions', 'Alumni Relations', 'Public Relations', 'Legal Affairs', 'Academic Affairs', 'Administrative Services');--> statement-breakpoint
CREATE TYPE "public"."StatusEnum" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."course_enum" AS ENUM('Bachelor of Science in Information Technology', 'Bachelor of Science in Accountancy', 'Bachelor of Science in Business Administration', 'Bachelor of Science in Journalism', 'Bachelor of Science in Criminology', 'Bachelor of Science in Psychology', 'Bachelor in Elementary Education', 'Bachelor in Secondary Education', 'Master of Science in Information Technology', 'Master of Science in Accountancy', 'Master of Science in Business Administration');--> statement-breakpoint
CREATE TYPE "public"."department" AS ENUM('College of Computer Studies', 'College of Accountancy', 'College of Criminal Justice Education', 'College of Teacher Education', 'College of Arts and Sciences', 'School of Graduate Studies');--> statement-breakpoint
CREATE TYPE "public"."dean_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."student_type" AS ENUM('regular', 'irregular');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" integer PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"office" "office" NOT NULL,
	"hire_date" date NOT NULL,
	"status" "StatusEnum" DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "departments_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"department_id" integer NOT NULL,
	CONSTRAINT "courses_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "deans" (
	"id" integer PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"start_date" date NOT NULL,
	"department_id" integer NOT NULL,
	"status" "dean_status" DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "directors" (
	"id" integer PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"office" "office" NOT NULL,
	"hire_date" date NOT NULL,
	"status" varchar(255) DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faculty" (
	"id" integer PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"hire_date" date NOT NULL,
	"status" "StatusEnum" DEFAULT 'active' NOT NULL,
	"department" "department" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "persons" (
	"id" integer PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"middle_name" varchar(255),
	"birth_date" date NOT NULL,
	"contact_number" varchar(20) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "persons_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "program_chairs" (
	"id" integer PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"start_date" date NOT NULL,
	"status" "StatusEnum" DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offices" (
	"id" integer PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"office" "office" NOT NULL,
	"hire_date" date NOT NULL,
	"status" "StatusEnum" DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" integer PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"enrollment_date" date NOT NULL,
	"department" "department" NOT NULL,
	"course" "course_enum" NOT NULL,
	"status" "StatusEnum" DEFAULT 'active' NOT NULL,
	"section" varchar(50) NOT NULL,
	"student_type" "student_type" DEFAULT 'regular' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deans" ADD CONSTRAINT "deans_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deans" ADD CONSTRAINT "deans_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directors" ADD CONSTRAINT "directors_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_chairs" ADD CONSTRAINT "program_chairs_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program_chairs" ADD CONSTRAINT "program_chairs_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offices" ADD CONSTRAINT "offices_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;