# Homework Homie

***

## Project Objectives

- Create a user-friendly homework platform, with fifth graders in mind.
- Integrate a homework management tool to help students keep track of homework outside of class.
- Include an authentication function to ensure student information is protected and more personalised.

## Technologies

The following technologies were used to develop Homework Homie:

### Languages

- HTML
- CSS
- JavaScript

### Libraries & Frameworks

- React (JavaScript library for building user interfaces)
- Express (backend framework for Node.js)
- MySQL (database technology)

### Tools

- Vite (frontend build tool)
- Node.js (server-side JavaScript execution environment)
- CORS (Cross-Origin Resource Sharing middleware for enabling cross-origin requests)

***

## Setup

- Fork this repo
- Clone this repo to your local machine.
- Open a new terminal window and `cd` into the root of your **PROJECT FOLDER**.
- To install the project dependencies, type and run: `npm install`.
- In the same terminal window, `cd client` and run `npm install` to install dependencies related to React (the client).

### Dependencies

In the case of the following dependencies not installing, please enter the following commands in the main folder:

- `npm install cors`
- `npm install dotenv`
- `npm install express`
- `npm install mysql`
- `npm install multer`

The following dependencies are vital for the authentication feature:

- `npm install jsonwebtoken`
- `npm install bcrypt`

Please install the following individual dependencies in the client folder:

- `npm install react-big-calendar`
- `npm install react-datepicker`

### Database migration

- Access your MySQL interface
- Create a new database for the users: CREATE DATABASE homework_homie;
- Ensure the 'migrate' script is within the package.json file of your main project folder
- Run 'npm run migrate' to get all the tables in the initial database model.
- Add a .env file to the project folder containing the MySQL authentication:

```bash
DB_HOST=localhost
DB_USER=root
DB_NAME=user
DB_PASS=YOURPASSWORD
SUPER_SECRET=shhhhhhh
```

> Note: Make sure to add your .env file to .gitignore to protect your local server data and password!

### Run Your Development Servers

- Open a new terminal window and `cd` into the root of your **PROJECT FOLDER**.
- Run `npm start` to start the Express server on port 4000.
- Open a new terminal window and `cd` into the `client` folder.
- Once in the client folder, run `npm run dev` to start client server in development mode with hot reloading in port 5173.
- You can test your client app in `http://localhost:5173`
- You can test the backend in Postman with the following: `http://localhost:4000/homework`

***

## Future Features

- Teacher dashboard to upload homework for all students in their respective homeroom, confirm homework submission and track student progress.
