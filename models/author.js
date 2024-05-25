const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const authorSchema = new mongoose.Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    family_name: { type: String, required: true, maxLength: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
});

// Virtual for full name
authorSchema.virtual("name").get(function () {
    let fullname = "";
    if (this.first_name && this.family_name) {
        fullname = `${this.first_name}, ${this.family_name}`
    }
    return fullname;
});

// Virtual for life span
authorSchema.virtual("life_span").get(function () {
    const birth = this.date_of_birth? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : "";
    const death = this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : "";
    
    return birth? `${birth} - ${death}`: ""
});

// format 'YYYY-MM-DD'
authorSchema.virtual("date_of_birth_yyyy_mm_dd").get(function () {
    return DateTime.fromJSDate(this.date_of_birth).toISODate(); 
});

authorSchema.virtual("date_of_death_yyyy_mm_dd").get(function () {
    return DateTime.fromJSDate(this.date_of_death).toISODate(); // format 'YYYY-MM-DD'
});

// Virtual for URL
authorSchema.virtual("url").get(function () {
    return `/catalog/authors/${this._id}`;
});

module.exports = mongoose.model("Author", authorSchema)