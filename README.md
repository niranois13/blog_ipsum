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
- Nginx v1.27.1

- Root (shared):

* ESLint v9.39.1
* Prettier v3.6.2
* Jest 29.7.0
* Supertest 7.0.0

- Back-end:

* NodeJS v24.11.0
* Express
* Sequelize
* bcryptjs v2.4.3
* MySQL v8.4.2
* mysql2 v3.11.3

- Front-end:

* React v18.3.1
* TanStack Query V5.50
* Zod v3.23.8
* Quill v2.0.3
* GlinProfanity (local) v.1.2.0
* ESLint

### Architecure

![architecture diagram](https://i.imgur.com/5FKVkxb.png)

### UML Class diagram

![uml class diagram](https://i.imgur.com/QTTB2wa.png)
