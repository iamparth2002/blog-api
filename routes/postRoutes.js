const express = require('express');
const router = express.Router();
const postController = require('../controllers/postControllers');
const { body } = require('express-validator');
const upload = require('../middleware/upload');

// List all posts
router.get('/posts', postController.getPosts);

// Get a specific post by ID
router.get('/posts/:id', postController.getPostById);

// Create a new post with validation
router.post('/posts', upload.single('image'), postController.createPost);
router.post('/posts/:postId/comments', postController.createComment);

// Update a post by ID
router.put('/posts/:id', upload.single('image'), postController.updatePost);

// Delete a post by ID
router.delete('/posts/:id', postController.deletePost);

module.exports = router;
