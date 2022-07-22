const persistUsers = (usersFilePath, writeFile) => (req, res, next) => {
  writeFile(usersFilePath, JSON.stringify(req.users));
  next();
};

module.exports = { persistUsers };
