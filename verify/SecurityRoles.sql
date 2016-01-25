SELECT 1/count(*) FROM pg_user WHERE usename = 'authenticator';
SELECT 1/count(*) FROM pg_roles WHERE rolname = 'editor';
SELECT 1/count(*) FROM pg_roles WHERE rolname = 'anonymous';
