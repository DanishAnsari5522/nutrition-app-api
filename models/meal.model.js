const mongoose = require('mongoose');

const meal = new mongoose.Schema({
    posted_by: {
        type: String,
        require: true
    },
    current_time: {
        type: String,
        require: true
    },
    meals:
    {
        type: Array,
        require: true
    }
})

module.exports = mongoose.model("meal", meal)