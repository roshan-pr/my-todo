const express = require('express');

const serveTodoPage = (templateRoot, readFile) =>
  (req, res, next) => {
    const todoPage = readFile(templateRoot + '/todo.html');
    res.end(todoPage);
  };

const serveTodoLists = (req, res) => {
  const username = req.session.name;
  if (username) {
    const response = { lists: req.todo[username].lists, username };
    res.json(response);
    return;
  }
  res.sendStatus(401);
};

const addItem = (todoFilePath, writeFile) => (req, res, next) => {
  console.log(req.todo);
  next()
};

const createTodoRouter = (config, readFile, writeFile) => {
  const { templateRoot, todoFilePath } = config;

  const todoRouter = express.Router();
  todoRouter.get('/', serveTodoPage(templateRoot, readFile));
  todoRouter.get('/api', serveTodoLists);
  todoRouter.get('/add-item', addItem(todoFilePath, writeFile));

  return todoRouter;
}

module.exports = createTodoRouter;
