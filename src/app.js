const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const { loadTodo } = require('./middleware/loadTodo.js');
const { loadUsers } = require('./middleware/loadUsers.js');

const { logout } = require('./handler/logout.js');

const createAuthRouter = require('./handler/authentication.js');
const createTodoRouter = require('./handler/todo.js');

const notFoundHandler = (req, res) => {
  res.status(404).end(`${req.url} not found`);
};

const verifyUser = (req, res, next) => {
  if (!req.session.isPopulated) {
    console.log(req.session);
    res.redirect('/login');
    return;
  }
  req.url = '/todo';
  next();
};

const createApp = (config, session, readFile, writeFile) => {
  const { staticRoot, todoFilePath, usersFilePath } = config;

  const app = express();
  if (process.env.NODE_ENV === 'production') {
    app.use(morgan('tiny'));
  }
  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));
  app.use(cookieSession(session));
  app.use(loadUsers(usersFilePath, readFile));
  app.use(loadTodo(todoFilePath, readFile));

  app.use(/^\/$/, verifyUser);
  app.use(createAuthRouter(todoFilePath, usersFilePath, readFile, writeFile));

  app.use('/todo', createTodoRouter(config, readFile, writeFile));
  app.use('/logout', logout);

  app.use(express.static(staticRoot));
  app.use(notFoundHandler); // not found
  return app;
};

module.exports = { createApp };
