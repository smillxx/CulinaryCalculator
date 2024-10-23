const express = require('express');
const {
  addRecipe,
  getRecipes,
  calculatePortionCost,
  convertMeasurements,
  adjustRecipeSize,
  suggestSalesPrice,
  handleRecipeFileUpload,
  handleCostFileUpload,
} = require('../controllers/recipeController');

module.exports = (upload) => {
  const router = express.Router();

  // POST route to add a recipe
  router.post('/add', addRecipe);

  // Debug GET route to check endpoint availability
  router.get('/add', (req, res) => {
    res.send('This endpoint only accepts POST requests. Please use POST to add a recipe.');
  });

  // GET route to retrieve all recipes
  router.get('/', getRecipes);

  // POST routes for other recipe operations
  router.post('/calculate-portion-price', calculatePortionCost);
  router.post('/convert-measurements', convertMeasurements);
  router.post('/adjust-recipe-size', adjustRecipeSize);
  router.post('/suggest-sales-price', suggestSalesPrice);

  // POST route for uploading recipe files
  router.post('/upload-recipe', upload.single('file'), handleRecipeFileUpload);
  router.post('/upload-cost', upload.single('file'), handleCostFileUpload);

  return router;
};