const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth")
const booksCTRL = require("../controllers/books")

router.post("/", auth, booksCTRL.createBook);
router.put("/:id", auth, booksCTRL.modifyBook);
router.delete("/:id", auth, booksCTRL.deleteBook);
router.get("/:id", booksCTRL.getOneBook);
router.get("/", booksCTRL.getAllBooks);

module.exports = router;
