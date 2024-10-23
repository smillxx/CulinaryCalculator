import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Dialog, DialogTitle, DialogContent, TextField, Grid } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';

function LandingPage() {
  const [openManualRecipe, setOpenManualRecipe] = useState(false);
  const [openFileUpload, setOpenFileUpload] = useState(false);
  const [openManualCost, setOpenManualCost] = useState(false);
  const [openCostFileUpload, setOpenCostFileUpload] = useState(false);
  const [manualRecipe, setManualRecipe] = useState({ name: '', ingredients: [] });
  const [ingredient, setIngredient] = useState({ name: '', quantity: '' });
  const [manualCost, setManualCost] = useState({ ingredients: [] });
  const [ingredientCost, setIngredientCost] = useState({ name: '', unitQuantity: '', cost: '' });
  const [costFile, setCostFile] = useState(null);
  const [recipeFile, setRecipeFile] = useState(null);
  const [totalPortions, setTotalPortions] = useState(1);
  const [uploadedRecipeData, setUploadedRecipeData] = useState([]);
  const [uploadedCostData, setUploadedCostData] = useState([]);

  useEffect(() => {
    console.log('Updated Recipe Data:', uploadedRecipeData);
  }, [uploadedRecipeData]);

  useEffect(() => {
    console.log('Updated Cost Data:', uploadedCostData);
  }, [uploadedCostData]);

  // Handlers for opening and closing dialogs
  const handleManualRecipeOpen = () => setOpenManualRecipe(true);
  const handleManualRecipeClose = () => setOpenManualRecipe(false);
  const handleFileUploadOpen = () => setOpenFileUpload(true);
  const handleFileUploadClose = () => {
    if (recipeFile) {
      const formData = new FormData();
      formData.append('file', recipeFile);

      console.log('Uploading Recipe File:', recipeFile); // Debugging line

      // Send the file to the backend
      axios.post('http://localhost:3000/api/recipes/upload-recipe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Recipe upload response:', response.data); // Debugging line
        alert(response.data.message);
        setUploadedRecipeData(response.data.data);
      })
      .catch((error) => {
        console.error('Recipe upload error:', error); // Debugging line
        alert(`Error: ${error.response ? error.response.data : 'Failed to upload file'}`);
      });
    }

    setOpenFileUpload(false);
  };
  const handleManualCostOpen = () => setOpenManualCost(true);
  const handleManualCostClose = () => setOpenManualCost(false);
  const handleCostFileUploadOpen = () => setOpenCostFileUpload(true);
  const handleCostFileUploadClose = () => {
    if (costFile) {
      const formData = new FormData();
      formData.append('file', costFile);

      console.log('Uploading Cost File:', costFile); // Debugging line

      // Send the file to the backend
      axios.post('http://localhost:3000/api/recipes/upload-cost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Cost upload response:', response.data); // Debugging line
        alert(response.data.message);
        setUploadedCostData(response.data.data);
      })
      .catch((error) => {
        console.error('Cost upload error:', error); // Debugging line
        alert(`Error: ${error.response ? error.response.data : 'Failed to upload file'}`);
      });
    }

    setOpenCostFileUpload(false);
  };

  const handleRecipeFileChange = (event) => {
    setRecipeFile(event.target.files[0]);
    console.log('Selected Recipe File:', event.target.files[0]); // Debugging line
  };

  const handleCostFileChange = (event) => {
    setCostFile(event.target.files[0]);
    console.log('Selected Cost File:', event.target.files[0]); // Debugging line
  };

  const handleAddIngredient = () => {
    console.log('Adding Ingredient:', ingredient); // Debugging line
    setManualRecipe({ ...manualRecipe, ingredients: [...manualRecipe.ingredients, ingredient] });
    setIngredient({ name: '', quantity: '' });
  };

  const handleAddManualRecipe = () => {
    // Save manual recipe data
    console.log('Manual Recipe before save:', manualRecipe); // Debugging line
    setUploadedRecipeData(manualRecipe.ingredients);
    setManualRecipe({ name: '', ingredients: [] });
    setOpenManualRecipe(false);
  };

  const handleAddCost = () => {
    console.log('Adding Ingredient Cost:', ingredientCost); // Debugging line
    setManualCost({ ...manualCost, ingredients: [...manualCost.ingredients, ingredientCost] });
    setIngredientCost({ name: '', unitQuantity: '', cost: '' });
  };

  const handleAddManualCost = () => {
    // Save manual cost data
    console.log('Manual Cost before save:', manualCost); // Debugging line
    setUploadedCostData(manualCost.ingredients);
    setManualCost({ ingredients: [] });
    setOpenManualCost(false);
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h4" gutterBottom>Welcome to the Culinary Calculator</Typography>
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleManualRecipeOpen}>
          Manually Enter Recipe
        </Button>
        <Dialog open={openManualRecipe} onClose={handleManualRecipeClose}>
          <DialogTitle>Enter Recipe Manually</DialogTitle>
          <DialogContent>
            <TextField
              label="Recipe Name"
              fullWidth
              margin="normal"
              value={manualRecipe.name}
              onChange={(e) => setManualRecipe({ ...manualRecipe, name: e.target.value })}
            />
            <TextField
              label="Ingredient Name"
              fullWidth
              margin="normal"
              value={ingredient.name}
              onChange={(e) => setIngredient({ ...ingredient, name: e.target.value })}
            />
            <TextField
              label="Quantity (e.g., 200g)"
              fullWidth
              margin="normal"
              value={ingredient.quantity}
              onChange={(e) => setIngredient({ ...ingredient, quantity: e.target.value })}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddIngredient}
              sx={{ mt: 2 }}
            >
              Add Ingredient
            </Button>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {manualRecipe.ingredients.map((ingredient, index) => (
                <Grid item xs={12} key={index}>
                  <Typography>{`${ingredient.name} - ${ingredient.quantity}`}</Typography>
                </Grid>
              ))}
            </Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddManualRecipe}
              sx={{ mt: 2 }}
            >
              Add Recipe
            </Button>
          </DialogContent>
        </Dialog>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="secondary" startIcon={<UploadFileIcon />} onClick={handleFileUploadOpen}>
          Upload Recipe File
        </Button>
        <Dialog open={openFileUpload} onClose={handleFileUploadClose}>
          <DialogTitle>Upload Recipe File</DialogTitle>
          <DialogContent>
            <Button
              variant="contained"
              component="label"
              color="primary"
              startIcon={<UploadFileIcon />}
            >
              Choose File
              <input type="file" accept=".txt,.csv,.json" hidden onChange={handleRecipeFileChange} />
            </Button>
          </DialogContent>
        </Dialog>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleManualCostOpen}>
          Manually Enter Cost Information
        </Button>
        <Dialog open={openManualCost} onClose={handleManualCostClose}>
          <DialogTitle>Enter Cost Information Manually</DialogTitle>
          <DialogContent>
            <TextField
              label="Ingredient Name"
              fullWidth
              margin="normal"
              value={ingredientCost.name}
              onChange={(e) => setIngredientCost({ ...ingredientCost, name: e.target.value })}
            />
            <TextField
              label="Unit Quantity (e.g., 22.6 kg)"
              fullWidth
              margin="normal"
              value={ingredientCost.unitQuantity}
              onChange={(e) => setIngredientCost({ ...ingredientCost, unitQuantity: e.target.value })}
            />
            <TextField
              label="Cost per Unit (e.g., $34.71)"
              fullWidth
              margin="normal"
              value={ingredientCost.cost}
              onChange={(e) => setIngredientCost({ ...ingredientCost, cost: e.target.value })}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCost}
              sx={{ mt: 2 }}
            >
              Add Ingredient Cost
            </Button>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {manualCost.ingredients.map((cost, index) => (
                <Grid item xs={12} key={index}>
                  <Typography>{`${cost.name} - ${cost.unitQuantity} - ${cost.cost}`}</Typography>
                </Grid>
              ))}
            </Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddManualCost}
              sx={{ mt: 2 }}
            >
              Add Cost Information
            </Button>
          </DialogContent>
        </Dialog>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="secondary" startIcon={<UploadFileIcon />} onClick={handleCostFileUploadOpen}>
          Upload Cost File
        </Button>
        <Dialog open={openCostFileUpload} onClose={handleCostFileUploadClose}>
          <DialogTitle>Upload Cost File</DialogTitle>
          <DialogContent>
            <Button
              variant="contained"
              component="label"
              color="primary"
              startIcon={<UploadFileIcon />}
            >
              Choose File
              <input type="file" accept=".txt,.csv,.json" hidden onChange={handleCostFileChange} />
            </Button>
          </DialogContent>
        </Dialog>
      </Box>
      <Box sx={{ mt: 2 }}>
        <TextField
          label="Total number of portions made by recipe"
          type="number"
          value={totalPortions}
          onChange={(e) => setTotalPortions(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={() => {
          const portions = 1; // Example portions value; you can modify this
          console.log('Calculating cost per portion for portions:', portions); // Debugging line

          // Use manually entered data if available, otherwise use uploaded data
          const recipeData = uploadedRecipeData.length > 0 ? uploadedRecipeData : null;
          const costData = uploadedCostData.length > 0 ? uploadedCostData : null;

          console.log('Recipe Data:', recipeData); // Debugging line
          console.log('Cost Data:', costData); // Debugging line

          if (!recipeData || !costData) {
            alert('Please upload or enter both recipe and cost information first.');
            return;
          }

          axios.post('http://localhost:3000/api/recipes/calculate-portion-price', {
            portions,
            totalPortions,
            recipeData,
            costData
          })
          .then((response) => {
            console.log('Calculation response:', response.data); // Debugging line
            alert(`Cost per portion: ${response.data.costPerPortion}`);
          })
          .catch((error) => {
            console.error('Calculation error:', error); // Debugging line
            alert(`Error: ${error.response ? error.response.data : 'Failed to calculate cost per portion'}`);
          });
        }}>
          Calculate Price per Portion
        </Button>
      </Box>
      {uploadedRecipeData.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Uploaded Recipe Data:</Typography>
          <pre>{JSON.stringify(uploadedRecipeData, null, 2)}</pre>
        </Box>
      )}
      {uploadedCostData.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Uploaded Cost Data:</Typography>
          <pre>{JSON.stringify(uploadedCostData, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
}

export default LandingPage;