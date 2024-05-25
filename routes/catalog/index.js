const express = require("express");
const router = express.Router();
const genreRouter = require("./genresRouter");
const authorRouter = require("./authorsRouter");
const bookRouter = require("./booksRouter");
const bookinstanceRouter = require("./bookinstancesRouter");

/// Home ///
router.get("/", (req, res) => {
    res.redirect("catalog/books")
})

/// BOOK ROUTES ///
router.use("/books", bookRouter);

/// AUTHOR ROUTES ///

router.use("/authors", authorRouter);

/// GENRE ROUTES ///
router.use("/genres", genreRouter);

/// BOOKINSTANCE ROUTES ///
router.use("/bookinstances", bookinstanceRouter);

module.exports = router;
