const { Todo } = require('../handler/todoClass.js');

const saveTodo = (todo, username, todoFilePath, writeFile) =>
  (content) => {
    todo[username] = content;
    const record = JSON.stringify(todo);
    writeFile(todoFilePath, record);
  };

const loadTodo = (todoFilePath, readFile, writeFile) => {
  const todo = JSON.parse(readFile(todoFilePath)) || {};

  return (req, res, next) => {
    const username = req.session.name;
    const { lastListId, lists } = todo[username];
    const todoSaver = saveTodo(todo, username, todoFilePath, writeFile);
    const todoRecord = new Todo(lastListId, lists, todoSaver);
    // req.todo = todo;
    req.todoRecord = todoRecord;
    next();
  };
}
module.exports = { loadTodo };