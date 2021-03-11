const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userName: String,
    password:String
});

module.exports = mongoose.model('Admin', adminSchema);