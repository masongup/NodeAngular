# NodeAngular
This is a test project for trying out various things with NodeJS and various Single-Page App technologies.

Currently set up to create a Postgresql DB backend and serve it as an API using Postgrest, with an Angular 1.x frontend doing most of the work.

Background thinking:

A standard webapp has a database, server code running on some framework (Backend), and front end html and code (Frontend), with the database being a dumb data store, the Frontend being mostly dumb layout and some minor JS code for validations and menus and such, and the majority of the business logic in the Backend. The basic idea of the SPA is that we avoid the slow responsiveness of full page loads while using the app by loading the whole site/app in a single page, and relying on JS to redo the DOM as needed in response to user events. With the right kind of app, this can involve moving a lot of the business logic from the Backend to the Frontend. Seeing Postgrest made me think - what if we moved all of the code out of the Backend, replacing it with this standardized database API, doing most of the business logic in the Frontend and using the database for security, validation, and any other required backend functions? So let's give that a try for a simple demo app and see what it looks like.

This clearly can't work for everything, like any kind of webapp that needs heavy functionality on the backend - doing much serious work in DB stored procedures sounds awful to test, maintain, debug, etc. But if the required backend stuff is known to be of minimal complexity, this just might make sense and provide great user experience.
