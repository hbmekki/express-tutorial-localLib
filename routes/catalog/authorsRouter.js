const express = require("express");
const router = express.Router();

// Require controller modules.
const authorController = require("../../controllers/authorController");

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get("/create", authorController.create);

// POST request for creating Author.
router.post("/create", authorController.store);

// GET request to delete Author.
router.get("/:id/delete", authorController.getDelete);

// POST request to delete Author.
router.post("/:id/delete", authorController.destroy);

// GET request to update Author.
router.get("/:id/update", authorController.edit);

// POST request to update Author.
router.post("/:id/update", authorController.update);

// GET request for one Author.
router.get("/:id", authorController.show);

// GET request for list of all Authors.
router.get("/", authorController.index);

module.exports = router;
