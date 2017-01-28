-- Revert NodeAngular:FixLogin from pg

BEGIN;

CREATE TYPE jwt_claims AS (role text, username text);

DROP FUNCTION login(text, text);

CREATE FUNCTION login (username text, password text) RETURNS jwt_claims LANGUAGE plpgsql AS
$$
DECLARE
  retVal jwt_claims;
BEGIN
IF password = 'Password-1' THEN
  SELECT 'editor' AS role, username AS username INTO retVal;
END IF;
RETURN retVal;
END;
$$;

DROP EXTENSION IF EXISTS pgjwt;
DROP EXTENSION IF EXISTS pgcrypto;

COMMIT;
