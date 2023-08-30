# Backend Project: NestJs with TypeScript and MongoDB

## Introduction

This project is a Backend Node.js application built using NestJs, MongoDB for database storage. It follows SOLID principles for better code design and maintainability.

## Getting Started

To run the development server, follow these steps:

1. Clone the repository to your local machine.
2. Install the required dependencies by running the following command in the project root:

```bash
npm install
# or
yarn
# or
pnpm install
```
Start the development server:
```bash
npm run start:dev
# or
yarn start:dev
# or
pnpm start:dev
```
The backend server will be up and running on the specified port.

## Why NestJS?

NestJS offers several advantages that align with our project's goals:

- **Modularity:** NestJS encourages a modular design, which makes our codebase more organized, maintainable, and testable. Each module focuses on a specific feature, making it easier to manage and extend the application.

- **Decorator-based Design:** NestJS utilizes decorators to define routes, controllers, services, and other application components. This approach enhances the readability of our code and reduces boilerplate.

- **Dependency Injection:** NestJS provides a built-in dependency injection system. This promotes the separation of concerns and facilitates unit testing by allowing us to inject mock dependencies.

- **Built-in HTTP Server:** NestJS includes a powerful HTTP server that can be used in conjunction with Express.js. This server supports routing, middleware, and other features that simplify the development of APIs.

## MongoDB
The project uses MongoDB as the database for storing application data. MongoDB is a NoSQL database, providing flexibility and scalability for handling various types of data.



## Deploy on Heroku
The project can be deployed on Heroku, a cloud platform that supports Node.js applications. To deploy your backend project on Heroku, follow these general steps:

1 . Sign up for a Heroku account if you don't have one.

2 . Install the Heroku CLI on your machine.

```bash
heroku login
```
1 . Create a new Heroku app:
```bash
heroku create your-app-name
```
2 . Set the necessary environment variables for MailTrap and MongoDB on Heroku:

```bash
heroku config:set MONGODB_URI=your_mongodb_uri
```

3. Push the code to Heroku:
```bash
git push heroku master
```



