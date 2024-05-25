const BookInstance = require("../models/bookinstance");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const statuses = ['Maintenance', 'Available', 'Loaned', 'Reserved'];

const bookInstanceValidators = [
    // Validate and sanitize fields.
    body("book", "Book must be specified").trim().isLength({ min: 3 }).escape(),
    body("imprint", "Imprint must be at least three charater long.")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    
    body("status").escape(),

    body("due_back", "Invalid date")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),
]

// Display list of all BookInstances.
exports.index = asyncHandler(async (req, res, next) => {
    const allBookInstances = await BookInstance.find().populate("book").exec();

    res.render("bookinstance/list", {
        title: "Book Instance List",
        bookinstance_list: allBookInstances,
    });
});

// Display detail page for a specific BookInstance.
exports.show = asyncHandler(async (req, res, next) => {
    const bookInstance = await BookInstance.findById(req.params.id)
        .populate("book")
        .exec();

    if (bookInstance === null) {
        // No results.
        const err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
    }

    res.render("bookinstance/detail", {
        title: "Book:",
        bookinstance: bookInstance,
    });
});

// Display BookInstance create form on GET.
exports.create = asyncHandler(async (req, res, next) => {
    const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

    res.render("bookinstance/form", {
        title: "Create BookInstance",
        book_list: allBooks,
        statuses
    });
});

// Handle BookInstance create on POST.
exports.store = [
    // Validators
    ...bookInstanceValidators,

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        const bookInstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
        });

        if (!errors.isEmpty()) {
            // There are errors.
            // Render form again with sanitized values and error messages.
            const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

            res.render("bookinstance/form", {
                title: "Create BookInstance",
                book_list: allBooks,
                statuses,
                selected_book: bookInstance.book._id,
                errors: errors.array(),
                bookinstance: bookInstance,
            });
            return;
        }
        // Data from form is valid
        await bookInstance.save();
        res.redirect("/catalog/bookInstances");

    }),
];

// Display BookInstance delete form on GET.
exports.getDelete = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)
    const bookinstance = await BookInstance.findById(req.params.id).exec();

    if (bookinstance === null) {
        // No results.
        res.redirect("/catalog/bookinstances");
        return;
    }

    res.render("bookinstance/delete", {
        title: "Delete Book Instance",
        bookinstance,
    });
});

// Handle BookInstance delete on POST.
exports.destroy = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)
    const bookinstance = await BookInstance.findById(req.params.id).exec();

    if (bookinstance !== null) {
        await BookInstance.findByIdAndDelete(req.body.bookinstanceid);
    }
    res.redirect("/catalog/bookinstances");
});

// Display BookInstance update form on GET.
exports.edit = asyncHandler(async (req, res, next) => {
    // Get book instance.
    const [bookinstance, allBooks] = await Promise.all([
        BookInstance.findById(req.params.id).exec(),
        Book.find({}, "title").sort({ title: 1 }).exec()
    ]);

    if (bookinstance === null) {
        // No results.
        const err = new Error("Book not found");
        err.status = 404;
        return next(err);
    }

    res.render("bookinstance/form", {
        title: "Update Book Instance",
        book_list: allBooks,
        statuses,
        selected_book: bookinstance.book._id,
        bookinstance: bookinstance,
    })
});

// Handle bookinstance update on POST.
exports.update = [
    // Validators
    ...bookInstanceValidators,

    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        const booknstanceData = {
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
        };

        if (!errors.isEmpty()) {
            // There are errors.
            // Render form again with sanitized values and error messages.
            const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

            res.render("bookinstance/form", {
                title: "Create BookInstance",
                book_list: allBooks,
                statuses,
                selected_book: bookInstance.book._id,
                errors: errors.array(),
                bookinstance: new BookInstance(booknstanceData),
            });
            return;
        }
        // Create a BookInstance object with escaped and trimmed data.
        await BookInstance.findByIdAndUpdate(req.params.id, booknstanceData).exec();
        res.redirect("/catalog/bookinstances");
    }),
];
