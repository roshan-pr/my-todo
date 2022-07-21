const express = require('express');
const { createLoginPage } = require('../view/loginPage.js');
const { createSignUpPage } = require('../view/signupPage.js');
const { loginUser } = require('./loginHandler');
const { signUpUser } = require('./signUpHandler.js');

const serveLoginPage = (req, res) => {
  const loginPage = createLoginPage();
  res.end(loginPage);
  return;
};

const serveSignupPage = (req, res) => {
  const signupPage = createSignUpPage();
  res.end(signupPage);
  return;
};

const serveSignupSuccessful = (req, res) => {
  const signupPage = createSignUpPage('Successfully registered');
  res.end(signupPage);
  return;
};

const persistUsers = (usersFilePath, writeFile) => (req, res, next) => {
  writeFile(usersFilePath, JSON.stringify(req.users));
  next();
};

const persistTodo = (todoFilePath, writeFile) => (req, res, next) => {
  writeFile(todoFilePath, JSON.stringify(req.todo));
  next();
};

const createAuthRouter = (todoFilePath, usersFilePath, readFile, writeFile) => {
  const authRouter = express.Router();
  authRouter.get('/login', serveLoginPage);

  authRouter.post('/login', loginUser);
  authRouter.post('/signup', signUpUser,
    persistTodo(todoFilePath, writeFile),
    persistUsers(usersFilePath, writeFile),
    serveSignupSuccessful);

  authRouter.get('/signup', serveSignupPage);
  return authRouter;
}

module.exports = createAuthRouter;
