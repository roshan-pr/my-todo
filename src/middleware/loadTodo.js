const loadTodo = (todoFilePath, readFile) =>
  (req, res, next) => {
    todo = JSON.parse(readFile(todoFilePath));
    req.todo = todo;
    next();
  };

module.exports = { loadTodo };