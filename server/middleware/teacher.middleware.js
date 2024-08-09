function teacher(req, res, next) {
  console.log('Teacher middleware executed');
  if (req.user.role === 'teacher' || req.user.role === 'admin') {
    console.log(req.user.role);  
    next();
  } else {
    return res.status(403).send('Only teachers and admins can make category requests.');
  }
}


module.exports = teacher;
