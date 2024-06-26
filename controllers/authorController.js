const Author = require("../models/author");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const authorValidators = [
    body("first_name")
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage("First name must be specified.")
        .isAlphanumeric()
        .withMessage("First name has non-alphanumeric characters."),
    body("family_name")
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage("Family name must be specified.")
        .isAlphanumeric()
        .withMessage("Family name has non-alphanumeric characters."),
    body("date_of_birth", "Invalid date of birth")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),
    body("date_of_death", "Invalid date of death")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate()
]

// Display list of all Authors.
exports.index = asyncHandler(async (req, res, next) => {
    const allAuthors = await Author.find().sort({ family_name: 1 }).exec();
    res.render("author/list", {
        title: "Author List",
        author_list: allAuthors,
    });
});

// Display detail page for a specific Author.
exports.show = asyncHandler(async (req, res, next) => {
    // Get details of author, books for specific author
    const [author, booksByAuthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }, "title summary").exec()
    ]);

    if (author === null) {
        // No results.
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
    }

    res.render("author/detail", {
        title: "Author Detail",
        author,
        author_books: booksByAuthor
    });
});

// Display Author create form on GET.
exports.create = asyncHandler(async (req, res, next) => {
    res.render("author/form", { title: "Create Author" });
});

// Handle Author create on POST.
exports.store = [
    // Validate and sanitize fields.
    ...authorValidators,

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Author object with escaped and trimmed data
        const author = new Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render("author/form", {
                title: "Create Author",
                author: author,
                errors: errors.array(),
            });
            return;
        }
        // Save author.
        await author.save();
        // Redirect to new author record.
        res.redirect("/catalog/authors");
    })
];

// Display Author delete form on GET.
exports.getDelete = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)
    const [author, allBooksByAuthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }, "title summary").exec(),
    ]);

    if (author === null) {
        // No results.
        res.redirect("/catalog/authors");
    }

    res.render("author/delete", {
        title: "Delete Author",
        author: author,
        author_books: allBooksByAuthor,
    });
});

// Handle Author delete on POST.
exports.destroy = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)
    const [author, allBooksByAuthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }, "title summary").exec(),
    ]);

    if (allBooksByAuthor.length > 0) {
        // Author has books. Render in same way as for GET route.
        res.render("author/delete", {
            title: "Delete Author",
            author: author,
            author_books: allBooksByAuthor,
        });
        return;
    }
    // Author has no books. Delete object and redirect to the list of authors.
    await Author.findByIdAndDelete(req.body.authorid);
    res.redirect("/catalog/authors");
});

// Display Author update form on GET.
exports.edit = asyncHandler(async (req, res, next) => {
    // Get details of author, books for specific author
    const [author, booksByAuthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }, "title summary").exec()
    ]);

    if (author === null) {
        // No results.
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
    }

    res.render("author/form", {
        title: "Update Author",
        author,
        author_books: booksByAuthor
    });
});

// Handle Author update on POST.
exports.update = [
    // Validate and sanitize fields.
    ...authorValidators,
    
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        const authorData = {
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
        };

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render("author/form", {
                title: "Update Author",
                author: new Author(authorData),
                errors: errors.array(),
            });
            return;
        }
        // Update author.
        const author = await Author.findByIdAndUpdate(req.params.id, authorData).exec();

        // Redirect list.
        res.redirect("/catalog/authors");
    })
];
