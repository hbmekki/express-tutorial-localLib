const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const debug = require("debug")("app");
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri).then((db) => {
    debug("Connected to db susscefully")
}).catch((err) => {
    debug("Failed to connect to db", err);
});
module.exports = {}