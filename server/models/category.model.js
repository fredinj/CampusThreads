const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryRequest', required: true }, // Ensure the correct model name
    tags: [{ type: String }] // Array of strings for tags
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
