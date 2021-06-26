CREATE SCHEMA core_domain;

CREATE TABLE "core_domain"."event_store" (
    "id" BIGSERIAL PRIMARY KEY,
    "version" INT NOT NULL,
    "type" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "payload" JSONB NULL
);

CREATE FUNCTION prevent_update()
RETURNS trigger AS
$BODY$
    BEGIN
        RAISE EXCEPTION 'Data modification not allowed';
    END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER prevent_update
BEFORE UPDATE
ON core_domain.event_store
FOR EACH ROW
EXECUTE PROCEDURE prevent_update();

-- We will set up a notification channel so that applications can subscribe to changes to the event store

CREATE FUNCTION notify_event_added()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify(
    'event_added',
    json_build_object(
      'event', row_to_json(NEW)
    )::text
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER event_added
AFTER INSERT
ON core_domain.event_store
FOR EACH ROW
EXECUTE PROCEDURE notify_event_added()
