const ensureLogin = (req, res, next) => {
  if (!req.session.isPopulated) {
    // console.log(req.session);
    res.redirect('/login');
    return;
  }
  req.url = '/todo';
  next();
};

module.exports = { ensureLogin };
