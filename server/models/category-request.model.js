const mongoose = require('mongoose');

const categoryRequestSchema = new mongoose.Schema({
    categoryName: { type: String, required: true },
    description: { type: String, required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    tags: { type: [String], required: false } // Adding tags field as an array of strings
},
{ timestamps: true });

const CategoryRequest = mongoose.model('category-request', categoryRequestSchema);

module.exports = CategoryRequest;
