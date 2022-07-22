const notFoundHandler = (req, res) => {
  res.status(404).end(`${req.url} not found`);
};
exports.notFoundHandler = notFoundHandler;
