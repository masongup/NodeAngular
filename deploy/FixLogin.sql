-- Deploy NodeAngular:FixLogin to pg
-- requires: login

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pgjwt;

DROP FUNCTION login(text, text);

CREATE OR REPLACE FUNCTION login (username text, password text) RETURNS text LANGUAGE plpgsql AS
$$
DECLARE
  retVal text;
BEGIN
IF password = 'Password-1' THEN
  SELECT sign(row_to_json(r), current_setting('app.jwt_token'))
  FROM
    (SELECT 'editor' AS role,
      username AS username,
      extract(epoch from (now() + '2 weeks'::interval))::integer AS exp
    ) AS r
  INTO retVal;
ELSIF password = 'Password-2' THEN
  SELECT sign(row_to_json(r), current_setting('app.jwt_token'))
  FROM
    (SELECT 'arf_posts' AS role,
      username AS username,
      extract(epoch from (now() + '2 weeks'::interval))::integer AS exp
    ) AS r
  INTO retVal;
END IF;
RETURN retVal;
END;
$$;

DROP TYPE jwt_claims;

COMMIT;
