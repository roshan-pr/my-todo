const express = require('express');
const { loadTodo } = require('../middleware/loadTodo.js');
const { createHomePage } = require('../view/todo.js');

const serveTodoPage = (req, res) => {
  const username = req.session.name;
  const todoPage = createHomePage(username);
  res.end(todoPage);
};

const serveTodoLists = (req, res) => {
  const username = req.session.name;
  if (username) {
    const { lists } = req.todoRecord.getInfo();
    res.json({ lists, username });
    return;
  }
  res.sendStatus(401);
};

const addList = (req, res, next) => {
  const todoRecord = req.todoRecord;

  const { title } = req.body;
  const modified = todoRecord.addList(title);
  if (!modified) {
    // console.log('Successfully added list:', title);
    res.status(400).json({ err: title + ' list cant be added' });
    return;
  };
  next();
};

const addItem = (req, res, next) => {
  const todoRecord = req.todoRecord;

  const { listId, description } = req.body;
  const modify = todoRecord.addItem(listId, description);
  if (!modify) {
    res.status(400).json({ err: description + ' cant be added' });
    return;
  };
  // console.log('Successfully added task:', description);
  next();
};

const editItem = (req, res, next) => {
  const todoRecord = req.todoRecord;

  const { listId, itemId, description } = req.body;
  const modify = todoRecord.editItem(listId, itemId, description);
  if (!modify) {
    res.status(400).json({ err: description + ' cant be edited' });
    return;
  };
  // console.log('Successfully edited task :', description);
  next();
};

const markItem = (req, res, next) => {
  const todoRecord = req.todoRecord;

  const { listId, itemId, status } = req.body;
  const modified = todoRecord.markItem(listId, itemId, status);
  if (!modified) {
    res.status(400).json({ err: 'cant change to ' + status });
    return;
  };
  // console.log('Successfully marked item', itemId, status);
  next();
};

const editList = (req, res, next) => {
  const todoRecord = req.todoRecord;

  const { listId, title } = req.body;
  const modified = todoRecord.editList(listId, title);
  if (!modified) {
    res.status(400).json({ err: 'cant edit this list' });
    return;
  };
  // console.log('Successfully deleted', listId);
  next();
};

const deleteList = (req, res, next) => {
  const todoRecord = req.todoRecord;

  const { listId } = req.body;
  const modified = todoRecord.deleteList(listId);
  if (!modified) {
    res.status(400).json({ err: 'cant delete this list' });
    return;
  };
  // console.log('Successfully deleted', listId);
  next();
};

const deleteItem = (req, res, next) => {
  const todoRecord = req.todoRecord;

  const { listId, itemId } = req.body;
  const modified = todoRecord.deleteItem(listId, itemId);
  if (!modified) {
    res.status(400).json({ err: 'cant delete this item' });
    return;
  };
  // console.log('Successfully deleted', listId, 'from', listId);
  next();
};

const persistTodoRecord = (req, res) => {
  try {
    req.todoRecord.save();
    res.sendStatus(200);
    return;
  } catch (err) {
    res.status(500).json({ err: 'persisting error' });
  }
};

const verifyUser = (req, res, next) => {
  if (!req.session.isPopulated) {
    res.redirect('/login');
    return;
  }
  next();
};

const createTodoRouter = (todoFilePath, readFile, writeFile) => {
  const todoRouter = express.Router();
  todoRouter.use(verifyUser, loadTodo(todoFilePath, readFile, writeFile));

  todoRouter.get('/', serveTodoPage);
  todoRouter.get('/api', serveTodoLists);
  todoRouter.post('/add-list', addList, persistTodoRecord);
  todoRouter.post('/add-item', addItem, persistTodoRecord);
  todoRouter.post('/mark-item', markItem, persistTodoRecord);
  todoRouter.post('/delete-list', deleteList, persistTodoRecord);
  todoRouter.post('/delete-item', deleteItem, persistTodoRecord);

  todoRouter.post('/edit-list', editList, persistTodoRecord);
  todoRouter.post('/edit-item', editItem, persistTodoRecord);

  return todoRouter;
}

module.exports = createTodoRouter;
