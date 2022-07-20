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

const createList = (id, title) => {
  return { id, lastItemId: 0, title, items: [] }
};

const addList = (todoFilePath, writeFile) => (req, res) => {
  const username = req.session.name;
  const todo = req.todo;
  const { lastListId, lists } = todo[username];
  const { title } = req.body;
  const newListId = lastListId + 1;
  const newList = createList(newListId, title);

  lists.push(newList); // Updating the memory
  todo[username] = { lastListId: newListId, lists }
  console.log(todo);
  try {
    writeFile(todoFilePath, JSON.stringify(todo));
    res.redirect('/todo');
  } catch (error) {
    res.status(500).end('Something went wrong');
  }
};

const createTodoRouter = (config, readFile, writeFile) => {
  const { templateRoot, todoFilePath } = config;

  const todoRouter = express.Router();
  todoRouter.get('/', serveTodoPage(templateRoot, readFile));
  todoRouter.get('/api', serveTodoLists);
  todoRouter.post('/add-list', addList(todoFilePath, writeFile));

  return todoRouter;
}

module.exports = createTodoRouter;
