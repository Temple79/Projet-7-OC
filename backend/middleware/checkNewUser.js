module.exports = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({ message: 'Username and password are required' });
    } else {
        next();
      }
  };