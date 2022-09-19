"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    text: {
        type: String,
        // required: true,
        minlength: 1,
        maxlength: 280,
    },
    image: [
        {
            type: String,
        }
    ],
    video: [
        {
            type: String,
        }
    ],
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
    },
    like: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Like'
        }],
    comment: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Comment'
        }]
}, { timestamps: true });
const Post = (0, mongoose_1.model)('Post', postSchema);
exports.default = Post;
