-- Fix id columns: drop identity (if present), ensure integer type,
-- create/init sequence, and set default to sequence nextval.

-- admins
ALTER TABLE admins ALTER COLUMN id DROP IDENTITY IF EXISTS;
ALTER TABLE admins ALTER COLUMN id TYPE integer USING id::integer;
CREATE SEQUENCE IF NOT EXISTS admins_id_seq;
ALTER SEQUENCE admins_id_seq OWNED BY admins.id;
SELECT setval('admins_id_seq', COALESCE((SELECT MAX(id) FROM admins), 1));
ALTER TABLE admins ALTER COLUMN id SET DEFAULT nextval('admins_id_seq');

-- courses
ALTER TABLE courses ALTER COLUMN id DROP IDENTITY IF EXISTS;
ALTER TABLE courses ALTER COLUMN id TYPE integer USING id::integer;
CREATE SEQUENCE IF NOT EXISTS courses_id_seq;
ALTER SEQUENCE courses_id_seq OWNED BY courses.id;
SELECT setval('courses_id_seq', COALESCE((SELECT MAX(id) FROM courses), 1));
ALTER TABLE courses ALTER COLUMN id SET DEFAULT nextval('courses_id_seq');

-- deans
ALTER TABLE deans ALTER COLUMN id DROP IDENTITY IF EXISTS;
ALTER TABLE deans ALTER COLUMN id TYPE integer USING id::integer;
CREATE SEQUENCE IF NOT EXISTS deans_id_seq;
ALTER SEQUENCE deans_id_seq OWNED BY deans.id;
SELECT setval('deans_id_seq', COALESCE((SELECT MAX(id) FROM deans), 1));
ALTER TABLE deans ALTER COLUMN id SET DEFAULT nextval('deans_id_seq');

-- departments
ALTER TABLE departments ALTER COLUMN id DROP IDENTITY IF EXISTS;
ALTER TABLE departments ALTER COLUMN id TYPE integer USING id::integer;
CREATE SEQUENCE IF NOT EXISTS departments_id_seq;
ALTER SEQUENCE departments_id_seq OWNED BY departments.id;
SELECT setval('departments_id_seq', COALESCE((SELECT MAX(id) FROM departments), 1));
ALTER TABLE departments ALTER COLUMN id SET DEFAULT nextval('departments_id_seq');

-- faculty
ALTER TABLE faculty ALTER COLUMN id DROP IDENTITY IF EXISTS;
ALTER TABLE faculty ALTER COLUMN id TYPE integer USING id::integer;
CREATE SEQUENCE IF NOT EXISTS faculty_id_seq;
ALTER SEQUENCE faculty_id_seq OWNED BY faculty.id;
SELECT setval('faculty_id_seq', COALESCE((SELECT MAX(id) FROM faculty), 1));
ALTER TABLE faculty ALTER COLUMN id SET DEFAULT nextval('faculty_id_seq');

-- offices
ALTER TABLE offices ALTER COLUMN id DROP IDENTITY IF EXISTS;
ALTER TABLE offices ALTER COLUMN id TYPE integer USING id::integer;
CREATE SEQUENCE IF NOT EXISTS offices_id_seq;
ALTER SEQUENCE offices_id_seq OWNED BY offices.id;
SELECT setval('offices_id_seq', COALESCE((SELECT MAX(id) FROM offices), 1));
ALTER TABLE offices ALTER COLUMN id SET DEFAULT nextval('offices_id_seq');

-- persons
ALTER TABLE persons ALTER COLUMN id DROP IDENTITY IF EXISTS;
ALTER TABLE persons ALTER COLUMN id TYPE integer USING id::integer;
CREATE SEQUENCE IF NOT EXISTS persons_id_seq;
ALTER SEQUENCE persons_id_seq OWNED BY persons.id;
SELECT setval('persons_id_seq', COALESCE((SELECT MAX(id) FROM persons), 1));
ALTER TABLE persons ALTER COLUMN id SET DEFAULT nextval('persons_id_seq');

-- program_chairs
ALTER TABLE program_chairs ALTER COLUMN id DROP IDENTITY IF EXISTS;
ALTER TABLE program_chairs ALTER COLUMN id TYPE integer USING id::integer;
CREATE SEQUENCE IF NOT EXISTS program_chairs_id_seq;
ALTER SEQUENCE program_chairs_id_seq OWNED BY program_chairs.id;
SELECT setval('program_chairs_id_seq', COALESCE((SELECT MAX(id) FROM program_chairs), 1));
ALTER TABLE program_chairs ALTER COLUMN id SET DEFAULT nextval('program_chairs_id_seq');

-- staff
ALTER TABLE staff ALTER COLUMN id DROP IDENTITY IF EXISTS;
ALTER TABLE staff ALTER COLUMN id TYPE integer USING id::integer;
CREATE SEQUENCE IF NOT EXISTS staff_id_seq;
ALTER SEQUENCE staff_id_seq OWNED BY staff.id;
SELECT setval('staff_id_seq', COALESCE((SELECT MAX(id) FROM staff), 1));
ALTER TABLE staff ALTER COLUMN id SET DEFAULT nextval('staff_id_seq');

-- students
ALTER TABLE students ALTER COLUMN id DROP IDENTITY IF EXISTS;
ALTER TABLE students ALTER COLUMN id TYPE integer USING id::integer;
CREATE SEQUENCE IF NOT EXISTS students_id_seq;
ALTER SEQUENCE students_id_seq OWNED BY students.id;
SELECT setval('students_id_seq', COALESCE((SELECT MAX(id) FROM students), 1));
ALTER TABLE students ALTER COLUMN id SET DEFAULT nextval('students_id_seq');