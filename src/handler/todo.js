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

const addList = (req, res, next) => {
  const username = req.session.name;
  const todo = req.todo;
  const { lastListId, lists } = todo[username];
  const { title } = req.body;
  const newListId = lastListId + 1;
  const newList = createList(newListId, title);

  lists.push(newList); // Updating the memory
  todo[username] = { lastListId: newListId, lists }
  next();
};

const addItem = (req, res, next) => {
  const username = req.session.name;
  const todo = req.todo[username];
  const { listId, description } = req.body;

  const list = todo.lists.find((list) => list.id === +listId);

  const newItemId = list.lastItemId + 1;
  const item = createItem(newItemId, description);

  list.items.push(item); // Updating in memory
  list.lastItemId = newItemId;
  req.todo[username] = todo;
  next();
};

const markItem = (req, res, next) => {
  const username = req.session.name;
  const todo = req.todo[username];
  const { listId, itemId, status } = req.body;

  const list = todo.lists.find(list => list.id === +listId);
  const item = list.items.find(item => item.id === +itemId);

  item.status = status; // Updating in memory
  req.todo[username] = todo;
  next();
};

const getElementIndex = (array, id) => {
  let index = 0;
  while (index < array.length) {
    if (array[index].id === id)
      return index;
    index++;
  }
  return -1;
};

const deleteList = (req, res, next) => {
  const username = req.session.name;
  const todo = req.todo[username];
  const { listId } = req.body;

  const listIndex = getElementIndex(todo.lists, +listId);
  if (listIndex >= 0) {
    todo.lists.splice(listIndex, 1);
  };
  req.todo[username] = todo;
  next();
};

const deleteItem = (req, res, next) => {
  const username = req.session.name;
  const todo = req.todo[username];
  const { listId, itemId } = req.body;
  const list = todo.lists.find((list) => list.id === +listId);

  const itemIndex = getElementIndex(list.items, +itemId);
  if (itemIndex >= 0) {
    list.items.splice(itemIndex, 1);
  };
  req.todo[username] = todo;
  next();
};


const persistTodo = (todoFilePath, writeFile) => (req, res) => {
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
  todoRouter.post('/add-list', addList, persistTodo(todoFilePath, writeFile));
  todoRouter.post('/add-item', addItem, persistTodo(todoFilePath, writeFile));
  todoRouter.post('/mark-item', markItem, persistTodo(todoFilePath, writeFile));
  todoRouter.post('/delete-list', deleteList, persistTodo(todoFilePath, writeFile));
  todoRouter.post('/delete-item', deleteItem, persistTodo(todoFilePath, writeFile));

  return todoRouter;
}

module.exports = createTodoRouter;
