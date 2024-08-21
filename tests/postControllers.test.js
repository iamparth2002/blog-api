const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const postRoutes = require('../routes/postRoutes');
const Post = require('../models/Post');

// Mock the Post model
jest.mock('../models/Post');

// Mock multer middleware
jest.mock('../middleware/upload', () => ({
    single: jest.fn(() => (req, res, next) => next()), // Mock .single() method to call next
}));

app.use(bodyParser.json());
app.use('/api', postRoutes);

describe('GET /api/posts', () => {
  it('should return a list of posts', async () => {
    // Mock data to be returned
    const mockPosts = [
      {
        _id: 'postId1',
        title: 'Post 1',
        content: 'Content of post 1',
        image: 'http://example.com/image1.jpg',
        author: {
          id: 'authorId1',
          name: 'Author 1',
          image: 'http://example.com/author1.jpg',
        },
        comments: [],
        createdAt: '2024-08-21T07:39:00.797Z',
      },
    ];

    // Mock Post.find() to return the mockPosts
    Post.find.mockResolvedValue(mockPosts);
      const findSpy = jest.spyOn(Post, 'find').mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockPosts),
      });
    // Post.sort.mockResolvedValue(mockPosts);
    
    const response = await request(app).get('/api/posts');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockPosts);
    expect(Post.find).toHaveBeenCalledTimes(1);
  });

  it('should update a post successfully', async () => {
    const postId = 'postId';
    const updatedPostData = {
      title: 'Updated Post Title',
      content: 'Updated content of the post',
      image: 'http://example.com/updated-image.jpg',
    };

    // Mock the post that will be returned
    const existingPost = {
      _id: postId,
      title: 'Old Post Title',
      content: 'Old content',
      image: 'http://example.com/old-image.jpg',
      save: jest.fn().mockResolvedValue({
        // ...existingPost,
        ...updatedPostData,
      }),
    };

    // Mock finding the post by ID
    Post.findById.mockResolvedValue(existingPost);

    const response = await request(app)
      .put(`/api/posts/${postId}`)
      .send(updatedPostData);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(updatedPostData.title);
    expect(response.body.content).toBe(updatedPostData.content);
    expect(response.body.image).toBe(updatedPostData.image);
    expect(Post.findById).toHaveBeenCalledWith(postId);
    expect(existingPost.save).toHaveBeenCalled();
  });

  it('should return 404 if the post is not found', async () => {
    const postId = 'postId';
    const updatedPostData = {
      title: 'Updated Post Title',
      content: 'Updated content of the post',
      image: 'http://example.com/updated-image.jpg',
    };

    // Mock finding the post by ID to return null
    Post.findById.mockResolvedValue(null);

    const response = await request(app)
      .put(`/api/posts/${postId}`)
      .send(updatedPostData);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Post not found');
    expect(Post.findById).toHaveBeenCalledWith(postId);
  });

  it('should return a post by ID', async () => {
    const postId = 'postId';
    const mockPost = {
      _id: postId,
      title: 'Post Title',
      content: 'Content of the post',
      image: 'http://example.com/image.jpg',
      author: {
        id: 'authorId',
        name: 'Author Name',
        image: 'http://example.com/author.jpg',
      },
      comments: [],
      createdAt: '2024-08-21T07:46:55.998Z',
    };

    // Mock Post.findById to return the mock post
    Post.findById.mockResolvedValue(mockPost);

    const response = await request(app).get(`/api/posts/${postId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockPost);
    expect(Post.findById).toHaveBeenCalledWith(postId);
  });

//   it('should create a new post', async () => {
//     const newPost = {
//       title: 'New Post Title',
//       content: 'Content of the new post',
//       image: 'http://example.com/new-image.jpg',
//       author: {
//         id: 'authorId',
//         name: 'Author Name',
//         image: 'http://example.com/author-image.jpg',
//       },
//     };

//     // Mock saving the post
//     Post.prototype.save = jest.fn().mockResolvedValue({
//       ...newPost,
//       _id: '123',
//       createdAt: "2024-08-21T07:46:55.998Z"
//     });

//     const response = await request(app).post('/api/posts').send(newPost);

//     expect(response.statusCode).toBe(201);
//     expect(response.body.title).toBe(newPost.title);
//     expect(response.body.content).toBe(newPost.content);
//     expect(response.body.image).toBe(newPost.image);
//     expect(Post.prototype.save).toHaveBeenCalled();
//   });

it('should delete a post by ID', async () => {
    const postId = 'postId';

    // Mock implementation for finding and deleting the post
    Post.findById.mockResolvedValue({
      _id: postId,
      title: 'Post Title',
      content: 'Content of the post',
      image: 'http://example.com/image.jpg',
      author: {
        id: 'authorId',
        name: 'Author Name',
        image: 'http://example.com/author.jpg',
      },
      comments: [],
      createdAt: '2024-08-21T07:46:55.998Z',
      deleteOne: jest.fn().mockResolvedValue({}),
    });

    const response = await request(app).delete(`/api/posts/${postId}`);

    expect(response.statusCode).toBe(200);
    // expect(response.body.message).toBe('Post deleted');
    expect(Post.findById).toHaveBeenCalledWith(postId);
  });

  it('should return 404 if post not found', async () => {
    const postId = 'nonExistentPostId';

    // Mock implementation for finding the post
    Post.findById.mockResolvedValue(null);

    const response = await request(app).delete(`/api/posts/${postId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Post not found');
    expect(Post.findById).toHaveBeenCalledWith(postId);
  });
});
