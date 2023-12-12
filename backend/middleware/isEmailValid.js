var emailRegex =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

module.exports = (req, res, next) => {
  const { email } = req.body;

  if (email.length > 254) {
    console.log("IsmailValid : trop de caractères"+ email);
    return res.status(400).send({ message: "Email incorrect" }); 
  }

  var valid = emailRegex.test(email);
  if (!valid) {
    console.log("IsmailValid : email invalide "+ email);
    return res.status(400).send({ message: "Email incorrect" });
  }

  next();
};
