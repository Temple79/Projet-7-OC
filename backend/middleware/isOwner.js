const Book = require("../models/book");

module.exports = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        next();
      }
    })
    .catch((error) => {
      console.log("Book -isOwner : ERROR 1 : " + error);
      res.status(400).json("Une erreur est intervenue lors du check du user");
    });
};
