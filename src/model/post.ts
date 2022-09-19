import { Schema, model } from "mongoose";
const postSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status:{
        type: String,
    },
    like:[{
        type:Schema.Types.ObjectId,
        ref:'Like'
    }],
    comment:[{
        type:Schema.Types.ObjectId,
        ref:'Comment'
    }]

}, { timestamps: true })

const Post = model('Post', postSchema);
export default Post;
