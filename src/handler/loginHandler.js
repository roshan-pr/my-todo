const assignSession = req => {
  const timeStamp = new Date().getTime();
  req.session.id = timeStamp;
  req.session.name = req.body.name;
};

const isValidUser = (req) => {
  const { users, body: { name, password } } = req;
  if (!users[name]) {
    return false;
  }
  return users[name].password === password;
};

const redirectToTodo = res => res.redirect('/todo');

const serveErrorCode = res => res.status(401).end();

const loginUser = (req, res) => {
  if (!isValidUser(req)) {
    serveErrorCode(res);
    return;
  }
  assignSession(req);
  redirectToTodo(res);
  return;
};

module.exports = { loginUser };
