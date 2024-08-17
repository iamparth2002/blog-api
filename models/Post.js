const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true }, // URL of the blog post image
    author: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        image: { type: String,} // URL of the author's image
    },
    comments: [{
        authorId: { type: String},
        authorName: { type: String, required: true },
        authorImage: { type: String, required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      }],
    createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;