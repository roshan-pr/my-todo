const validCredential = (req, res, next) => {
  const { name, password } = req.body;
  if (name && password) {
    next();
    return;
  }
  res.redirect('/login');
  return;
};

module.exports = { validCredential };
