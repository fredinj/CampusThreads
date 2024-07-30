function teacher(req, res, next) {
  console.log('Teacher middleware executed'); // Debugging log
  if (req.user.role !== 'teacher') {
      return res.status(403).send('Only teachers can make category requests.');
  }
  next();
}

module.exports = teacher;
