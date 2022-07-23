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

  let status = false;
  const { title } = req.body;
  if (todoRecord.addList(title)) {
    // console.log('Successfully added list:', title);
    todoRecord.save();
    status = true;
  };
  req.todoStatus = status;
  next();
};

const addItem = (req, res, next) => {
  const todoRecord = req.todoRecord;

  let status = false;
  const { listId, description } = req.body;
  if (todoRecord.addItem(listId, description)) {
    // console.log('Successfully added task:', description);
    todoRecord.save();
    status = true;
  };
  req.todoStatus = status;
  next();
};

const markItem = (req, res, next) => {
  const todoRecord = req.todoRecord;

  let todoStatus = false;
  const { listId, itemId, status } = req.body;
  if (todoRecord.markItem(listId, itemId, status)) {
    // console.log('Successfully marked item', itemId, status);
    todoRecord.save();
    todoStatus = true;
  };
  req.todoStatus = todoStatus;
  next();
};

const deleteList = (req, res, next) => {
  const todoRecord = req.todoRecord;

  let todoStatus = false;
  const { listId } = req.body;
  if (todoRecord.deleteList(listId)) {
    // console.log('Successfully deleted', listId);
    todoRecord.save();
    todoStatus = true;
  };
  req.todoStatus = todoStatus;
  next();
};

const deleteItem = (req, res, next) => {
  const todoRecord = req.todoRecord;

  let todoStatus = false;
  const { listId, itemId } = req.body;
  if (todoRecord.deleteItem(listId, itemId)) {
    // console.log('Successfully deleted', listId, 'from', listId);
    todoRecord.save();
    todoStatus = true;
  };
  req.todoStatus = todoStatus;
  next();
};

const persistTodoRecord = (req, res) => {
  if (req.todoStatus) {
    res.sendStatus(200);
    return;
  }
  res.status(500).end('Something went wrong');
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
  todoRouter.use(loadTodo(todoFilePath, readFile, writeFile));

  todoRouter.get('/', verifyUser, serveTodoPage);
  todoRouter.get('/api', serveTodoLists);
  todoRouter.post('/add-list', addList, persistTodoRecord);
  todoRouter.post('/add-item', addItem, persistTodoRecord);
  todoRouter.post('/mark-item', markItem, persistTodoRecord);
  todoRouter.post('/delete-list', deleteList, persistTodoRecord);
  todoRouter.post('/delete-item', deleteItem, persistTodoRecord);

  return todoRouter;
}

module.exports = createTodoRouter;
