const registerUser = (req, res, next) => {
  const { users, body: { name, password } } = req;
  users[name] = { name, password };

  const todo = req.todo;
  todo[name] = { lists: [], lastListId: 0 }
  next();
};

module.exports = { registerUser };
