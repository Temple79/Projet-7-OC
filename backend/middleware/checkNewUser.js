module.exports = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    console.log("checkNewUser : email ou password vide " + email);
    return res
      .status(400)
      .send({ message: "Username and password are required" });
  }
  next();
};
