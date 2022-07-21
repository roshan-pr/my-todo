const logout = (req, res) => {
  req.session = null;
  res.redirect('/login');
};

module.exports = { logout };
