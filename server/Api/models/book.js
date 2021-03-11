const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type:String,
        required: true
    },
    author: String,
    bookCoverUrl:String,
    paidStatus: Boolean,
    bookFileUrl: String,
    reviews:[
        {
            type:String
        }
    ],
    categoryId: String,
    totalRatings:{
        type:Number,
        default: 0
    },
    ratigsUser:{
        type:Number,
        default: 0
    },
    averageRatings:{
        type:Number,
        default: 0
    },
    createdAt: Date,
    time:Number,
    searchTags:{
        type:String,
        text: true
    }
});

module.exports = mongoose.model('Book', bookSchema);