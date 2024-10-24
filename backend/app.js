const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Store uploaded files in the 'uploads' directory
const recipeRoutes = require('./routes/recipeRoutes')(upload);

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/recipes', recipeRoutes);

// Default route for root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Culinary Budget API');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});