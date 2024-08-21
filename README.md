
Blog API

This is the backend API for the Blog application. It handles CRUD operations for blog posts, including creating, updating, deleting, and retrieving posts and comments.

Table of Contents
- Getting Started
- Environment Variables
- API Endpoints
- Testing
- CI/CD Pipeline

Getting Started

Prerequisites:
- Node.js (v18.17.0 or higher)
- MongoDB (or a MongoDB Atlas cluster)
- Git

Installation Steps:
1. Clone the repository.
2. Install dependencies.
3. Set up your environment variables (see Environment Variables section).
4. Start the development server.
5. The API will run on http://localhost:5000.

Environment Variables
Create a .env file in the root directory of the project and add the following environment variables:

- MONGO_URI=your_mongo_database_uri
- CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
- CLOUDINARY_API_KEY=your_cloudinary_api_key
- CLOUDINARY_API_SECRET=your_cloudinary_api_secret
- PORT=5000
- Replace the placeholders with your actual values.

API Endpoints
Posts:
- GET /api/posts: Get all posts.
- GET /api/posts/{id}: Get a post by ID.
- POST /api/posts : Create a new post. (Requires title, content, image, and author)
- PUT /api/posts/{id}: Update an existing post.
- DELETE /api/posts/: Delete a post by ID.
- POST /api/posts/comments: Add a comment to a post. (Requires authorName, authorImage, and content)
  
Testing:
 This project uses Jest for testing. To run the tests, use the npm test command. You can mock certain modules or middleware (e.g., upload.single) to simplify testing.

CI/CD Pipeline:
 This project uses GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD). The CI/CD pipeline is defined in .github/workflows/deploy.yml and runs on every push to the main branch to deploy the API to Vercel.
