import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Grid } from '@mui/material';

function RecipeForm() {
  const [recipe, setRecipe] = useState({ name: '', ingredients: [] });
  const [ingredient, setIngredient] = useState({ name: '', quantity: '', unit: '', cost: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://52.5.232.71:8080/api/recipes/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe),
    });
    const data = await response.json();
    console.log(data);
  };

  const handleAddIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ingredient] });
    setIngredient({ name: '', quantity: '', unit: '', cost: '' });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: 'auto', mt: 5, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        Add a Recipe
      </Typography>
      <TextField
        label="Recipe Name"
        fullWidth
        variant="outlined"
        margin="normal"
        value={recipe.name}
        onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
      />
      <Typography variant="h6" gutterBottom>
        Ingredients
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Ingredient Name"
            fullWidth
            variant="outlined"
            margin="normal"
            value={ingredient.name}
            onChange={(e) => setIngredient({ ...ingredient, name: e.target.value })}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Quantity"
            fullWidth
            variant="outlined"
            margin="normal"
            value={ingredient.quantity}
            onChange={(e) => setIngredient({ ...ingredient, quantity: e.target.value })}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Unit"
            fullWidth
            variant="outlined"
            margin="normal"
            value={ingredient.unit}
            onChange={(e) => setIngredient({ ...ingredient, unit: e.target.value })}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Cost"
            fullWidth
            variant="outlined"
            margin="normal"
            value={ingredient.cost}
            onChange={(e) => setIngredient({ ...ingredient, cost: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleAddIngredient}>
            Add Ingredient
          </Button>
        </Grid>
      </Grid>
      <Box mt={3}>
        <Button type="submit" variant="contained" color="secondary" fullWidth>
          Submit Recipe
        </Button>
      </Box>
    </Box>
  );
}

export default RecipeForm;