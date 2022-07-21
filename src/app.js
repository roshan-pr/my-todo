const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const { loadTodo } = require('./middleware/loadTodo.js');

const createAuthRouter = require('./handler/authentication.js');
const createTodoRouter = require('./handler/todo.js');

const noFileHandler = (req, res) => {
  res.status(404).end('file not found');
};


const createApp = (config, users, session, readFile, writeFile) => {
  const { staticRoot, todoFilePath } = config;

  const app = express();
  app.use(morgan('tiny'));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(cookieSession(session));
  app.use(createAuthRouter(users));
  app.use(loadTodo(todoFilePath, readFile));
  // app.use((req, res, next) => { console.log(req.body); next(); });

  app.use('/todo', createTodoRouter(config, readFile, writeFile));

  app.use(express.static(staticRoot));
  app.use(noFileHandler);
  return app;
};

module.exports = { createApp };
