const Genre = require("../models/genre");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");

const { body, validationResult } = require("express-validator");

const genreValidators = [
    body("name", "Genre name must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape()
];

// Display list of all Genre.
exports.index = asyncHandler(async (req, res, next) => {
    const genres = await Genre.find().sort({ name: 1 }).exec();
    res.render("genre/list", {
        title: "Genre List",
        genre_list: genres,
    });
});

// Display detail page for a specific Genre.
exports.show = asyncHandler(async (req, res, next) => {
    // Get details of genre and all associated books (in parallel)
    const [genre, booksInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({ genre: req.params.id }, "title summary").exec(),
    ]);
    if (genre === null) {
        // No results.
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
    }

    res.render("genre/detail", {
        title: "Genre Detail",
        genre: genre,
        genre_books: booksInGenre,
    });
});

// Display Genre create form on GET.
exports.create = asyncHandler(async (req, res, next) => {
    res.render("genre/form", { title: "Create Genre" });
});

// Handle Genre create on POST.
exports.store = [
    // Validate and sanitize the name field.
    ...genreValidators,
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        const genre = new Genre({ name: req.body.name });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render("genre/form", {
                title: "Create Genre",
                genre: genre,
                errors: errors.array(),
            });
            return;
        } 
        // Data from form is valid.
        // Check if Genre with same name already exists.
        const genreExists = await Genre.findOne({ name: req.body.name })
            .collation({ locale: "en", strength: 2 })
            .exec();
        if (genreExists) {
            // Genre exists, redirect to its detail page.
            return res.redirect(genreExists.url);
        } 
        await genre.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect("/catalog/genres");
    })
];

// Display Genre delete form on GET.
exports.getDelete = asyncHandler(async (req, res, next) => {
    // Get details of genre and all books in it(in parallel)
    const [genre, allBooksInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({ genre: req.params.id }, "title summary").exec(),
    ]);

    if (genre === null) {
        // No results.
        return res.redirect("/catalog/genres");
    }

    res.render("genre/delete", {
        title: "Delete Genre",
        genre,
        genre_books: allBooksInGenre,
    });
});

// Handle Genre delete on POST.
exports.destroy = asyncHandler(async (req, res, next) => {
    // Get details of genre and all books in it(in parallel)
    const [genre, allBooksInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({ genre: req.params.id }, "title summary").exec(),
    ]);

    if (allBooksInGenre.length > 0) {
        // There are books in the genre.
        res.render("genre/delete", {
            title: "Delete Genre",
            genre,
            genre_books: allBooksInGenre,
        });
        return;
    }
    // Author has no books. Delete object and redirect to the list of authors.
    await Genre.findByIdAndDelete(req.body.genreid);
    res.redirect("/catalog/genres");
});

// Display Genre update form on GET.
exports.edit = asyncHandler(async (req, res, next) => {
    // Get book instance.
    const genre = await Genre.findById(req.params.id).exec();

    if (genre === null) {
        // No results.
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
    }

    res.render("genre/form", {
        title: "Update Genre",
        genre
    })
});

// Handle Genre update on POST.
exports.update = [
    // Validate and sanitize the name field.
    ...genreValidators,

    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render("genre/form", {
                title: "Create Genre",
                genre: new Genre({ name: req.body.name }),
                errors: errors.array(),
            });
            return;
        } 
        // Update old genre with new info.
        const genre = await Genre.findById(req.params.id).exec();
        genre.name = req.body.name;
        await genre.save();
        res.redirect("/catalog/genres");
    })
];
