const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const { loadTodo } = require('./middleware/loadTodo.js');
const { loadUsers } = require('./middleware/loadUsers.js');
const { ensureLogin } = require('./middleware/ensureLogin.js');
const { logout } = require('./handler/logout.js');
const { notFoundHandler } = require('./handler/notFoundHandler.js');
const createAuthRouter = require('./router/authRouter.js');
const createTodoRouter = require('./handler/todo.js');

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
  app.use(/^\/$/, ensureLogin);
  app.use(createAuthRouter(todoFilePath, usersFilePath, readFile, writeFile));

  app.use('/todo', createTodoRouter(todoFilePath, readFile, writeFile));
  app.use('/logout', logout);

  app.use(express.static(staticRoot));
  app.use(notFoundHandler); // not found
  return app;
};

module.exports = { createApp };
