var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

module.exports = (req, res, next) => {
  const { email } = req.body;

  if (email.length > 254) 
  {res.status(400).send({ message: 'Email incorrect' })};

  var valid = emailRegex.test(email);
  if (!valid) 
  {res.status(400).send({ message: 'Email incorrect' })};

  var parts = email.split("@");
  if (parts[0].length > 64) 
  {res.status(400).send({ message: 'Email incorrect' })};

  var domainParts = parts[1].split(".");
  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  )
  {res.status(400).send({ message: 'Email incorrect' })};

  next();
};
