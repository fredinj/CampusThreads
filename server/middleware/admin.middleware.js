const admin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).send({ message: 'Access denied.' });
  next();
};

module.exports = admin;