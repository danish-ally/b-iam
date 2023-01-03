const Mongoose = require("mongoose");
const { Schema } = Mongoose;

// Contact Schema
const contactSchema = new Schema(
    {
        _id: {
            type: Schema.ObjectId,
            auto: true,
        },

        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },

    {
        timestamps: true,
    }
);

module.exports = Mongoose.model("contact", contactSchema);
