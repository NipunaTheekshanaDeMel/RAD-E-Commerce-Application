const mongoose = require('mongoose');
const { Schema } = mongoose;

// Create a Mongoose schema
const roleSchema = new Schema(
    {
        name: { type: String },
        created: { type: Date, default: Date.now },
        updated: { type: Date, default: Date.now },
    },
    { timestamps: true } // Adds createdAt & updatedAt
);

// Create and export the model
const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
