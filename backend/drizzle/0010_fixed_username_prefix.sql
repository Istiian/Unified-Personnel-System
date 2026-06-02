CREATE OR REPLACE FUNCTION "set_person_username"() RETURNS trigger AS $$
BEGIN
	IF NEW."username" IS NULL OR NEW."username" = '' THEN
		NEW."username" := '2026' || lpad((NEW.id % 100000)::text, 5, '0');
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint