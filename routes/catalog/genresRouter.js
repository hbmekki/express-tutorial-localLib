const express = require("express");
const router = express.Router();

// Require controller modules.
const genreController = require("../../controllers/genreController");

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/create", genreController.create);

//POST request for creating Genre.
router.post("/create", genreController.store);

// GET request to delete Genre.
router.get("/:id/delete", genreController.getDelete);

// POST request to delete Genre.
router.post("/:id/delete", genreController.destroy);

// GET request to update Genre.
router.get("/:id/update", genreController.edit);

// POST request to update Genre.
router.post("/:id/update", genreController.update);

// GET request for one Genre.
router.get("/:id", genreController.show);

// GET request for list of all Genre.
router.get("/", genreController.index);

module.exports = router;
