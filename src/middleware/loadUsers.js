const loadUsers = (usersFilePath, readFile) =>
  (req, res, next) => {
    const users = JSON.parse(readFile(usersFilePath)) || {};
    req.users = users;
    next();
  };

module.exports = { loadUsers };
