const loadTodo = (todoFilePath, readFile) =>
  (req, res, next) => {
    const todo = JSON.parse(readFile(todoFilePath)) || {};
    req.todo = todo;
    next();
  };

module.exports = { loadTodo };