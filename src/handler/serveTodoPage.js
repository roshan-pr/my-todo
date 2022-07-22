const { createHomePage } = require('../view/todo.js');

const serveTodoPage = (req, res) => {
  const username = req.session.name;
  const todoPage = createHomePage(username);
  res.end(todoPage);
  return;
};

module.exports = { serveTodoPage };
