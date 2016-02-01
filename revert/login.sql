-- Revert NodeAngular:login from pg

BEGIN;

DROP FUNCTION login (text, text);

DROP TYPE jwt_claims;

COMMIT;
