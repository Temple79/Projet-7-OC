const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth")
const booksCTRL = require("../controllers/books");
const multer = require('../middleware/multer-config');
const isOwner = require("../middleware/isOwner");
const sharp = require("../middleware/sharp");


router.post("/", auth, multer, sharp, booksCTRL.createBook);
router.get("/", booksCTRL.getAllBooks);
router.get("/bestrating", booksCTRL.bestRating);
router.put("/:id", auth, multer, isOwner, sharp, booksCTRL.modifyBook);
router.delete("/:id", auth, isOwner, booksCTRL.deleteBook);
router.get("/:id", booksCTRL.getOneBook);
router.post("/:id/rating", auth, booksCTRL.newRating);

module.exports = router;
