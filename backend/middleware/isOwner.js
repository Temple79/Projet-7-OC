
module.exports = (req, res, next) => { 
    if (book.userId != req.auth.userId) {
    res.status(401).json({ message: 'Non-autorisé !' });
  } else {
    next();
  }
}
