# Blog Ipsum

This repository contains a blog project. It was made for Holberton School FullStack specialization validation.

## Project Overview

Blog Ipsum is a technical demonstration, the idea is to build a blog system, for a sole user - the admin.
He will be able to post, update and delete articles and comments.
Visitors - unregistered users - will be able to post comments.

While having basic features, this app is built with scalability in mind. Future features should be easily added later.
Also, security will be a priority, with hashed password and IP addresses, comment moderation through text filters and some spam/flood prevention in order to prevent bot spamming and malevolent use of the app.
Finally, accessibility will be inforced.

### The Teck Stack

- Docker
- Ngin

- Root (shared):

* ESLint
* Prettier
* Jest (to come)
* Supertest (to come)

- Back-end:

* NodeJS
* Express
* Sequelize
* bcryptjs
* MySQL
* jsonwebtoken
* cookie-parser

- Front-end (not started yet):

* React
* TanStack Query
* Zod
* Quill ()
* GlinProfanity (local)

### Architecure

![architecture diagram](https://i.imgur.com/5FKVkxb.png)

### UML Class diagram

![uml class diagram](https://i.imgur.com/QTTB2wa.png)

## Usage

In order for this project to run, you first need to have Docker installed and running.

Clone this repository:
`git clone https://github.com/niranois13/blog_ipsum.git`

Rename `.env-example` as `.env` and replace placeholder values to real ones __(never push a .env <3)__

Then, while at project's root, run:
`npm run dev`, a script that will run `docker-compose up --build`
This will build and run the needed Docker containers and volumes.

You can now test the project at `localhost/`, the api running on `localhost/api/`


### Other available scripts:

* `npm run lint` / `npm run lint:fix` that will check/fix code formating and some errors thanks to ESLint/Prettier.
* `npm run format` to check and fix code format thanks to Prettier only.
* `npm run stop` to fully stop the Docker containers (volumes are safe).
* `npm run build` to build the Docke image, without running it.
* `npm run test` to run jest tests. Not implemented yet.


## Features

- Admin panel with a WYSIWYG text editor: Quill, in order to create and manage articles. Also a comment management system.
- The possibility for visitors to post comments. Those comments are moderated with glin-profanity, some RegEx and some spam limitations and bot control.
- Everything is stored in a MySQL database, except for article's cover images that are stored on Cloudinary.
- Room for scalability. 
