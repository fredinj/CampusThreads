const mongoose = require('mongoose');

const categoryRequestSchema = new mongoose.Schema({
    categoryName: { type: String, required: true },
    description: { type: String, required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    tags: [{ type: String }] // Array of strings for tags
});

const CategoryRequest = mongoose.model('CategoryRequest', categoryRequestSchema);

module.exports = CategoryRequest;
