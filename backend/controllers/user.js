const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/User");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
		.catch((error) => {
			console.log("User-signup : ERROR 1 : " + error);
			res
			  .status(400)
			  .json("Une erreur est intervenue lors du signup");
		  });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User
    .findOne({ email: req.body.email })
    .then((user) => {
      	if (!user) {
        	console.log("controller.user.login : impossible de trouver le user par rapport au mail " + req.body.email);
        	return res
          		.status(401)
          		.json({ message: "Paire login/mot de passe incorrecte" });
      	}
      	bcrypt
        	.compare(req.body.password, user.password)
        	.then((valid) => {
          		if (!valid) {
            		console.log("controller.user.login : impossible de trouver le user par rapport au password ");
            		return res
              			.status(401)
              			.json({ message: "Paire login/mot de passe incorrecte" });
          		}
				res.status(200).json({
					userId: user._id,
					token: jwt.sign({ userId: user._id }, process.env.JWT_TOKEN_SECRET, {expiresIn: "24h",}),
				});
			})
       		.catch((error) => {
          		console.log("controller.user.login : ERROR 1 :  " + error);
				res.status(500).json( " Une erreur est intervenue, merci de contacter l'administrateur (catch1)" );
			});
	})
    .catch((error) => {
		console.log("controller.user.login : ERROR 2 :  " + error);
		res.status(500).json( " Une erreur est intervenue, merci de contacter l'administrateur (catch2)" );
	});
};
