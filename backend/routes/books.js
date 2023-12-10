const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth")
const booksCTRL = require("../controllers/books");
const multer = require('../middleware/multer-config');
const isOwner = require("../middleware/isOwner");

router.post("/", auth, multer, booksCTRL.createBook);
router.put("/:id", auth, multer, isOwner, booksCTRL.modifyBook);
router.delete("/:id", auth, isOwner, booksCTRL.deleteBook);
router.get("/:id", booksCTRL.getOneBook);
router.get("/", booksCTRL.getAllBooks);

module.exports = router;
