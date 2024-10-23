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