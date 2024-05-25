const express = require("express");
const router = express.Router();

// Require controller modules.
const bookInstanceController = require("../../controllers/bookInstanceController");

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get(
    "/create",
    bookInstanceController.create,
);

// POST request for creating BookInstance.
router.post(
    "/create",
    bookInstanceController.store,
);

// GET request to delete BookInstance.
router.get(
    "/:id/delete",
    bookInstanceController.getDelete,
);

// POST request to delete BookInstance.
router.post(
    "/:id/delete",
    bookInstanceController.destroy,
);

// GET request to update BookInstance.
router.get(
    "/:id/update",
    bookInstanceController.edit,
);

// POST request to update BookInstance.
router.post(
    "/:id/update",
    bookInstanceController.update,
);

// GET request for one BookInstance.
router.get("/:id", bookInstanceController.show);

// GET request for list of all BookInstance.
router.get("/", bookInstanceController.index);

module.exports = router;
