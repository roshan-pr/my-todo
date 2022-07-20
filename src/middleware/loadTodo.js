const loadTodo = (todoFilePath, readFile) =>
  (req, res, next) => {
    req.todo = JSON.parse(readFile(todoFilePath));
    next();
  };

module.exports = { loadTodo };