const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'category-requests', required: true },
    tags: { type: [String], required: false } // Adding tags field as an array of strings
},
{ timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;