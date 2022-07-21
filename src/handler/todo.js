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

const createItem = (id, description) => {
  return { id, description, status: false };
};

const addList = (todoFilePath, writeFile) => (req, res) => {
  const username = req.session.name;
  const todo = req.todo;
  const { lastListId, lists } = todo[username];
  const { title } = req.body;
  const newListId = lastListId + 1;
  const newList = createList(newListId, title);

  lists.unshift(newList); // Updating the memory
  todo[username] = { lastListId: newListId, lists }
  try {
    writeFile(todoFilePath, JSON.stringify(todo));
    res.redirect('/todo');
  } catch (error) {
    res.status(500).end('Something went wrong');
  }
};

const addItem = (todoFilePath, writeFile) => (req, res) => {
  const username = req.session.name;
  const todo = req.todo[username];
  const { listId, description } = req.body;

  const list = todo.lists.find((list) => list.id === +listId);

  const newItemId = list.lastItemId + 1;
  const item = createItem(newItemId, description);

  list.items.push(item); // Updating in memory
  list.lastItemId = newItemId;
  req.todo[username] = todo;
  try {
    writeFile(todoFilePath, JSON.stringify(req.todo));
    res.redirect('/todo');
  } catch (error) {
    res.status(500).end('Something went wrong');
  }
};

const markItem = (todoFilePath, writeFile) => (req, res) => {
  const username = req.session.name;
  const todo = req.todo[username];
  const { listId, itemId, status } = req.body;

  const list = todo.lists.find(list => list.id === +listId);
  const item = list.items.find(item => item.id === +itemId);

  item.status = status; // Updating in memory
  req.todo[username] = todo;
  try {
    writeFile(todoFilePath, JSON.stringify(req.todo));
    res.sendStatus(200);
  } catch (error) {
    res.status(500).end('Something went wrong');
  }
};

const verifyUser = (req, res, next) => {
  if (!req.session.name) {
    res.redirect('/login');
    return;
  }
  next();
};

const createTodoRouter = (config, readFile, writeFile) => {
  const { templateRoot, todoFilePath } = config;

  const todoRouter = express.Router();
  todoRouter.use(verifyUser);
  todoRouter.get('/', serveTodoPage(templateRoot, readFile));
  todoRouter.get('/api', serveTodoLists);
  todoRouter.post('/add-list', addList(todoFilePath, writeFile));
  todoRouter.post('/add-item', addItem(todoFilePath, writeFile));
  todoRouter.post('/mark-item', markItem(todoFilePath, writeFile));

  return todoRouter;
}

module.exports = createTodoRouter;
