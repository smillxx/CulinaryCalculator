const fs = require('fs');
const csv = require('csv-parser');

let uploadedRecipe = null;
let uploadedCosts = null;

const addRecipe = (req, res) => {
  res.status(201).send('Recipe added successfully');
};

const getRecipes = (req, res) => {
  res.status(200).json({ recipes: [] });
};

const calculatePortionCost = (req, res) => {
  if (!uploadedRecipe || !uploadedCosts) {
    return res.status(400).send('Please upload both recipe and cost files first.');
  }
  const portions = parseFloat(req.body.portions) || 1;
  const totalPortions = parseFloat(req.body.totalPortions) || 1;
  let totalCost = 0;

  console.log('Calculating portion cost for recipe:', uploadedRecipe); // Debugging line
  console.log('Using cost data:', uploadedCosts); // Debugging line
  console.log('Total Portions:', totalPortions); // Debugging line

  uploadedRecipe.forEach((ingredient) => {
    if (!ingredient || !ingredient.name || !ingredient.quantity) {
      console.warn('Invalid ingredient data:', ingredient); // Debugging line
      return;
    }

    const costEntry = uploadedCosts.find((cost) => cost.name && cost.name.trim().toLowerCase() === ingredient.name.trim().toLowerCase());
    if (costEntry) {
      let ingredientQuantity = parseFloat(ingredient.quantity);
      let unitQuantity = parseFloat(costEntry.unitQuantity);
      const costPerUnit = parseFloat(costEntry.cost.replace(/[^0-9.-]+/g, ""));  // Remove any symbols from cost

      if (isNaN(ingredientQuantity) || isNaN(unitQuantity) || isNaN(costPerUnit)) {
        console.warn(`Invalid data for ingredient ${ingredient.name}`); // Debugging line
        return;
      }

      // Handle unit conversion if needed
      if (ingredient.quantity.includes('g') && costEntry.unitQuantity.includes('kg')) {
        console.log(`Converting grams to kilograms for ingredient ${ingredient.name}`); // Debugging line
        ingredientQuantity = ingredientQuantity / 1000; // Convert grams to kilograms
      } else if (ingredient.quantity.includes('kg') && costEntry.unitQuantity.includes('g')) {
        console.log(`Converting kilograms to grams for ingredient ${ingredient.name}`); // Debugging line
        unitQuantity = unitQuantity / 1000; // Convert kilograms to grams
      }

      console.log(`Ingredient: ${ingredient.name}, Quantity: ${ingredientQuantity}, Unit Quantity: ${unitQuantity}, Cost per Unit: ${costPerUnit}`); // Debugging line

      const ingredientCost = (costPerUnit / unitQuantity) * ingredientQuantity;
      console.log(`Cost for ingredient ${ingredient.name}: ${ingredientCost}`); // Debugging line
      totalCost += ingredientCost;
    } else {
      console.warn(`No cost entry found for ingredient ${ingredient.name}`); // Debugging line
    }
  });

  console.log('Total Cost:', totalCost); // Debugging line

  const costPerPortion = totalPortions > 0 ? totalCost / totalPortions : 0;
  console.log('Cost Per Portion:', costPerPortion); // Debugging line
  res.status(200).json({ costPerPortion });
};

const convertMeasurements = (req, res) => {
  const { measurement, unit } = req.body;
  let convertedMeasurement;
  if (unit === 'metric') {
    convertedMeasurement = measurement * 0.035274;
  } else if (unit === 'imperial') {
    convertedMeasurement = measurement / 0.035274;
  } else {
    return res.status(400).send('Invalid unit provided');
  }
  res.status(200).json({ convertedMeasurement });
};

const adjustRecipeSize = (req, res) => {
  const { ingredients, factor } = req.body;
  const adjustedIngredients = ingredients.map((ingredient) => ({
    ...ingredient,
    quantity: ingredient.quantity * factor,
  }));
  res.status(200).json({ adjustedIngredients });
};

const suggestSalesPrice = (req, res) => {
  const { totalCost, overheadPercentage, profitMargin } = req.body;
  const overheadCost = totalCost * (overheadPercentage / 100);
  const profit = totalCost * (profitMargin / 100);
  const salesPrice = totalCost + overheadCost + profit;
  res.status(200).json({ salesPrice });
};

const handleRecipeFileUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded. Please upload a valid file.');
  }

  const recipeData = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      if (row && row.name && row.quantity) {
        console.log('Parsed row:', row); // Debugging line
        recipeData.push(row);
      } else {
        console.warn('Invalid row data:', row); // Debugging line
      }
    })
    .on('end', () => {
      uploadedRecipe = recipeData;
      console.log('Uploaded Recipe:', uploadedRecipe); // Debugging line
      res.status(200).json({ message: 'Recipe file uploaded successfully', fileName: req.file.originalname, data: uploadedRecipe });
    })
    .on('error', (error) => {
      console.error('Error processing recipe file:', error); // Debugging line
      res.status(500).send('Error processing the recipe file.');
    });
};

const handleCostFileUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded. Please upload a valid file.');
  }

  const costData = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      if (row && row.name && row.unitQuantity && row.cost) {
        console.log('Parsed row:', row); // Debugging line
        costData.push(row);
      } else {
        console.warn('Invalid row data:', row); // Debugging line
      }
    })
    .on('end', () => {
      uploadedCosts = costData;
      console.log('Uploaded Costs:', uploadedCosts); // Debugging line
      res.status(200).json({ message: 'Cost file uploaded successfully', fileName: req.file.originalname, data: uploadedCosts });
    })
    .on('error', (error) => {
      console.error('Error processing cost file:', error); // Debugging line
      res.status(500).send('Error processing the cost file.');
    });
};

module.exports = {
  addRecipe,
  getRecipes,
  calculatePortionCost,
  convertMeasurements,
  adjustRecipeSize,
  suggestSalesPrice,
  handleRecipeFileUpload,
  handleCostFileUpload,
};