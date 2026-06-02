ALTER TABLE "persons" DROP CONSTRAINT IF EXISTS "persons_email_unique";--> statement-breakpoint
ALTER TABLE "persons" ADD COLUMN IF NOT EXISTS "username" varchar(255);--> statement-breakpoint
UPDATE "persons"
SET "username" = extract(year from now())::text || lpad((id % 100000)::text, 5, '0')
WHERE "username" IS NULL;--> statement-breakpoint
ALTER TABLE "persons" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'persons_username_unique'
	) THEN
		ALTER TABLE "persons" ADD CONSTRAINT "persons_username_unique" UNIQUE("username");
	END IF;
END $$;--> statement-breakpoint
CREATE OR REPLACE FUNCTION "set_person_username"() RETURNS trigger AS $$
BEGIN
	IF NEW."username" IS NULL OR NEW."username" = '' THEN
		NEW."username" := extract(year from now())::text || lpad((NEW.id % 100000)::text, 5, '0');
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint
DROP TRIGGER IF EXISTS "set_person_username_before_insert" ON "persons";--> statement-breakpoint
CREATE TRIGGER "set_person_username_before_insert"
BEFORE INSERT ON "persons"
FOR EACH ROW
EXECUTE FUNCTION "set_person_username"();