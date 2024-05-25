const express = require("express");
const router = express.Router();

// Require controller modules.
const bookController = require("../../controllers/bookController");

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get("/create", bookController.create);

// POST request for creating Book.
router.post("/create", bookController.store);

// GET request to delete Book.
router.get("/:id/delete", bookController.getDelete);

// POST request to delete Book.
router.post("/:id/delete", bookController.destroy);

// GET request to update Book.
router.get("/:id/update", bookController.edit);

// POST request to update Book.
router.post("/:id/update", bookController.update);

// GET request for one Book.
router.get("/:id", bookController.show);

// GET request for list of all Book items.
router.get("/", bookController.index);


module.exports = router;
