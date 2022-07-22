const authSession = (req, res, next) => {
  // console.log('session', req.session);
  if (req.session.isPopulated) {
    res.redirect('/todo');
    return;
  }
  next();
};

module.exports = { authSession };
