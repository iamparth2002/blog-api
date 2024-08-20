const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const cors = require('cors');
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', postRoutes);

// Start the server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
