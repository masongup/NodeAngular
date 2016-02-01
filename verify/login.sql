-- Verify NodeAngular:login on pg

BEGIN;

SELECT l.role, l.username FROM login('test', 'test') l;

ROLLBACK;
