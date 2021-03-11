const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    reviewText:{
        type: String,
        required: true
    },
    user:{
        type: String,
        required: true
    },
    book:{
        type:String,
        required: true
    },
    rating: Number,
    createdAt: Date,
    time: Number
});

module.exports = mongoose.model('Review', reviewSchema);