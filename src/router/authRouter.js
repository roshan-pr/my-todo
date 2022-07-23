const express = require('express');
const { serveSignupPage } = require('../handler/serveSignUpPage.js');
const { serveLoginPage } = require('../handler/serveLoginPage.js');
const { serveTodoPage } = require('../handler/serveTodoPage.js');

const { assignSession } = require('../middleware/assignSession.js');
const { authSession } = require('../middleware/authSession.js');
const { persistTodo } = require('../middleware/persistTodo.js');
const { persistUsers } = require('../middleware/persistUser.js');
const { authUser } = require('../middleware/authUser.js');
const { existingUser } = require('../middleware/existingUser.js');
const { registerUser } = require('../middleware/registerUser.js');
const { loadTodo } = require('../middleware/loadTodo.js');

const redirectToTodo = (req, res) => res.redirect('/todo');

const createAuthRouter = (todoFilePath, usersFilePath, readFile, writeFile) => {
  const authRouter = express.Router();
  const injectTodo = loadTodo(todoFilePath, readFile, writeFile);

  authRouter.get('/login', authSession, serveLoginPage());
  authRouter.post('/login', authUser, assignSession, redirectToTodo);
  authRouter.post('/signup', existingUser, injectTodo, registerUser,
    persistTodo(todoFilePath, writeFile),
    persistUsers(usersFilePath, writeFile),
    assignSession, redirectToTodo);

  authRouter.get('/signup', authSession, serveSignupPage());
  return authRouter;
}

module.exports = createAuthRouter;
