const express = require("express");
const router = express.Router();

const booksCTRL = require("../controllers/books")

router.post("/", booksCTRL.createBook);
router.put("/:id", booksCTRL.modifyBook);
router.delete("/:id", booksCTRL.deleteBook);
router.get("/:id", booksCTRL.getOneBook);
router.get("/", booksCTRL.getAllBooks);

module.exports = router;
