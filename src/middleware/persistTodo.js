const persistTodo = (todoFilePath, writeFile) => (req, res, next) => {
  writeFile(todoFilePath, JSON.stringify(req.todo));
  next();
};

module.exports = { persistTodo };
