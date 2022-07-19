const express = require('express');
const { loginUser } = require('./loginHandler');

const serveLoginPage = (req, res, next) => {
  req.url = '/login.html';
  next();
};

const serveSignupPage = (req, res, next) => {
  req.url = '/signup.html';
  next();
};

const createAuthRouter = (users) => {
  const authRouter = express.Router();
  authRouter.get('/login', serveLoginPage);

  authRouter.use((req, res, next) => { req.users = users; next(); });
  authRouter.post('/login', loginUser);
  authRouter.get('/signup', serveSignupPage);
  return authRouter;
}

module.exports = createAuthRouter;
