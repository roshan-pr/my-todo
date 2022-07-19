const express = require('express');

const serveTodoPage = (templateRoot, readFile) =>
  (req, res, next) => {
    const todoPage = readFile(templateRoot + '/todo.html');
    res.end(todoPage);
  };

const createTodoRouter = (templateRoot, readFile) => {
  const todoRouter = express.Router();
  todoRouter.get('/', serveTodoPage(templateRoot, readFile));
  return todoRouter;
}

module.exports = createTodoRouter;
