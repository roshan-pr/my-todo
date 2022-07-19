const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');

const createAuthRouter = require('./handler/authentication.js');
const createTodoRouter = require('./handler/todo.js');

const createApp = (config, users, session, readFile) => {
  const { staticRoot, templateRoot } = config;

  const app = express();
  app.use(morgan('tiny'));
  app.use(express.urlencoded({ extended: true }));
  // app.use((req, res, next) => { console.log(req.body); next(); });

  app.use(cookieSession(session));
  app.use(createAuthRouter(users));
  app.use('/todo', createTodoRouter(templateRoot, readFile));

  app.use(express.static(staticRoot));

  return app;
};

module.exports = { createApp };
