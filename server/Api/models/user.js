const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email:{
        type:String,
        required: true
    },
    password:{
        type:String
    },
    userName: String,
    paidMembership: {
       type: Boolean,
       default: false
    },
    savedBook: [String],
    reviews: [String]
});

module.exports = mongoose.model('User', userSchema);