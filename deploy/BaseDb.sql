BEGIN;

CREATE TABLE public.authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50)
);

CREATE TABLE public.books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(50),
  description TEXT,
  author_id INT NOT NULL REFERENCES authors
);

COMMIT;
