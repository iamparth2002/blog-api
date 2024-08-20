const Post = require('../models/Post');

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createComment = async (req, res) => {
  const { postId } = req.params;
  const { authorId, authorName, authorImage, content } = req.body;

  try {
    // Validate the input
    if (!content || !authorName || !authorImage) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Create the comment object
    const newComment = {
      authorId,
      authorName,
      authorImage,
      content,
      createdAt: new Date(),
    };

    // Add the comment to the post's comments array
    post.comments.push(newComment);

    // Save the post with the new comment
    await post.save();

    res.status(201).json({ message: 'Comment added successfully', post });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    image: req.file.path, // Cloudinary URL
    author: {
      id: req.body.author.id,
      name: req.body.author.name,
      image: req.body.author.image,
    },
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

// Update an existing post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    if (req.file) {
      post.image = req.file.path; // Update Cloudinary URL
    }
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
