const Book = require("../models/book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre enregistré !" });
    })
    .catch((error) => {
      console.log("controller.book.create : ERROR 1 :  " + error);
      res
        .status(400)
        .json(
          " Une erreur est intervenue, merci de contacter l'administrateur (catch1)"
        );
    });
};

exports.modifyBook = (req, res, next) => {
  let bookObject;
  if (req.file) {
    bookObject = {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    };
    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.updateOne(
            { _id: req.params.id },
            { ...bookObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Livre modifié !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(400).json({ error }));
  } else {
    bookObject = { ...req.body };
    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
      .then(() => {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Livre modifié !" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(400).json({ error }));
  }
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      const filename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(200).json({ message: "Livre supprimé !" });
          })
          .catch((error) => res.status(401).json({ error }));
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.newRating = (req, res, next) => {
  Book
    .findOne({ _id: req.params.id })
    .then((book) => {
      const userRateCheck = book.ratings.map((el) => el.userId);
      if (userRateCheck.includes(req.body.userId)) {
        res.status(403).json({ message: "Livre déjà noté" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          {
            $push: {
              ratings: { userId: req.body.userId, grade: req.body.rating },
            },
          }
        ).then(() => {
          return Book.findOne({ _id: req.params.id })
            .then((book) => {
              const rates = book.ratings.map((el) => el.grade);
              const allRates = rates.reduce(
                (accumulator, currentValue) => accumulator + currentValue
              );
              
              const average = Math.ceil((allRates / rates.length));
              return Book.updateOne(
                { _id: req.params.id },
                {
                  $set: {
                    averageRating: average,
                  },
                }
              )
                .then(() => {
                  return Book.findOne({ _id: req.params.id })
                    .then((book) => {
                      res.status(201).json(book);
                    })
                    .catch((error) => {
                      console.log("Book -newRating : ERROR 1 : " + error);
                      res
                        .status(400)
                        .json("Une erreur est intervenue lors de la notation");
                    });
                })
                .catch((error) => {
                  console.log("Book -newRating : ERROR 2 : " + error);
                  res
                    .status(400)
                    .json("Une erreur est intervenue lors de la notation");
                });
            })
            .catch((error) => {
              console.log("Book -newRating : ERROR 3 : " + error);
              res
                .status(400)
                .json("Une erreur est intervenue lors de la notation");
            });
        });
      }
    })
    .catch((error) => {
      console.log("Book -newRating : ERROR 4 : " + error);
      res.status(400).json("Une erreur est intervenue lors de la notation");
    });
};

exports.bestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
