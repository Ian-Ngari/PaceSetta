import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SPOONACULAR_API_KEY = '14c68bc2a797419190f06bec4f70e3b5';

const aiTips = [
  "Eat a variety of foods to ensure balanced nutrition.",
  "Stay hydrated—drink at least 8 glasses of water daily.",
  "Include lean proteins, whole grains, and healthy fats in your meals.",
  "Limit processed foods and added sugars.",
  "Plan your meals ahead to avoid unhealthy choices."
];

const NutritionPage = () => {
  const [tip, setTip] = useState(aiTips[Math.floor(Math.random() * aiTips.length)]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Search for recipes
  const searchRecipes = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=10&addRecipeNutrition=true&apiKey=${SPOONACULAR_API_KEY}`
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setResults(data.results);
      } else {
        setError('No results found.');
      }
    } catch {
      setError('Failed to fetch recipes.');
    }
    setLoading(false);
  };

  // Add recipe to meal plan
  const addToMealPlan = (recipe) => {
    setMealPlan(prev => [...prev, recipe]);
  };

  // Remove recipe from meal plan
  const removeFromMealPlan = (idx) => {
    setMealPlan(prev => prev.filter((_, i) => i !== idx));
  };

  // Fetch recipe details (ingredients & instructions)
  const fetchRecipeDetails = async (id, recipe) => {
    setSelectedRecipe(recipe);
    setDetailsLoading(true);
    setRecipeDetails(null);
    try {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`
      );
      const data = await res.json();
      setRecipeDetails(data);
    } catch {
      setRecipeDetails(null);
    }
    setDetailsLoading(false);
  };

  // Calculate totals
  const totals = mealPlan.reduce(
    (acc, recipe) => {
      if (recipe.nutrition && recipe.nutrition.nutrients) {
        const cal = recipe.nutrition.nutrients.find(n => n.name === "Calories");
        const protein = recipe.nutrition.nutrients.find(n => n.name === "Protein");
        const fat = recipe.nutrition.nutrients.find(n => n.name === "Fat");
        const carbs = recipe.nutrition.nutrients.find(n => n.name === "Carbohydrates");
        acc.calories += cal ? cal.amount : 0;
        acc.protein += protein ? protein.amount : 0;
        acc.fat += fat ? fat.amount : 0;
        acc.carbs += carbs ? carbs.amount : 0;
      }
      return acc;
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  // Handler for closing the ingredients modal
  const handleCloseModal = () => {
    setSelectedRecipe(null);
    setRecipeDetails(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-8"
        >
          Meal Planner 
        </motion.h1>

        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">AI-Powered Nutrition Tip</h2>
          <p className="text-gray-700">{tip}</p>
          <button
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            onClick={() => setTip(aiTips[Math.floor(Math.random() * aiTips.length)])}
          >
            New Tip
          </button>
        </div>

        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Search Recipes</h2>
          <form onSubmit={searchRecipes} className="flex mb-4">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter a food or recipe (e.g. chicken, salad)"
              className="flex-1 border rounded-l px-4 py-2"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-r hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <div>
            {results.length > 0 && (
              <ul className="space-y-4">
                {results.map((recipe, idx) => (
                  <li key={recipe.id} className="p-4 bg-gray-50 rounded shadow flex items-center justify-between">
                    <div className="flex items-center">
                      {recipe.image && (
                        <img src={recipe.image} alt={recipe.title} className="w-12 h-12 rounded mr-4" />
                      )}
                      <div>
                        <div className="font-bold">{recipe.title}</div>
                        <div className="text-sm text-gray-700">
                          Calories: {recipe.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount || 'N/A'}
                          , Protein: {recipe.nutrition?.nutrients?.find(n => n.name === "Protein")?.amount || 'N/A'}g
                          , Fat: {recipe.nutrition?.nutrients?.find(n => n.name === "Fat")?.amount || 'N/A'}g
                          , Carbs: {recipe.nutrition?.nutrients?.find(n => n.name === "Carbohydrates")?.amount || 'N/A'}g
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        className="ml-2 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                        onClick={() => fetchRecipeDetails(recipe.id, recipe)}
                        type="button"
                      >
                        View Ingredients
                      </button>
                      <button
                        className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        onClick={() => addToMealPlan(recipe)}
                        type="button"
                      >
                        Add
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Meal Plan</h2>
          {mealPlan.length === 0 ? (
            <div className="text-gray-500">No recipes added yet.</div>
          ) : (
            <>
              <ul className="space-y-4 mb-4">
                {mealPlan.map((recipe, idx) => (
                  <li key={recipe.id} className="p-4 bg-gray-50 rounded shadow flex items-center justify-between">
                    <div className="flex items-center">
                      {recipe.image && (
                        <img src={recipe.image} alt={recipe.title} className="w-12 h-12 rounded mr-4" />
                      )}
                      <div>
                        <div className="font-bold">{recipe.title}</div>
                        <div className="text-sm text-gray-700">
                          Calories: {recipe.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount || 'N/A'}
                          , Protein: {recipe.nutrition?.nutrients?.find(n => n.name === "Protein")?.amount || 'N/A'}g
                          , Fat: {recipe.nutrition?.nutrients?.find(n => n.name === "Fat")?.amount || 'N/A'}g
                          , Carbs: {recipe.nutrition?.nutrients?.find(n => n.name === "Carbohydrates")?.amount || 'N/A'}g
                        </div>
                      </div>
                    </div>
                    <button
                      className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      onClick={() => removeFromMealPlan(idx)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="p-4 bg-indigo-50 rounded shadow text-indigo-900 font-semibold">
                Totals: Calories: {totals.calories.toFixed(0)}, Protein: {totals.protein.toFixed(1)}g, Fat: {totals.fat.toFixed(1)}g, Carbs: {totals.carbs.toFixed(1)}g
              </div>
            </>
          )}
        </div>

        {/* Recipe Details Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div
              className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative flex flex-col max-h-[90vh] overflow-y-auto"
              style={{ scrollbarGutter: 'stable' }}
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <h2 className="text-xl font-bold mb-2">{selectedRecipe.title}</h2>
              <button
                className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={handleCloseModal}
              >
                Back
              </button>
              {detailsLoading && <div>Loading ingredients...</div>}
              {recipeDetails && (
                <>
                  <h3 className="font-semibold mb-1">Ingredients:</h3>
                  <ul className="mb-3 list-disc list-inside">
                    {recipeDetails.extendedIngredients.map((ing, idx) => (
                      <li key={idx}>{ing.original}</li>
                    ))}
                  </ul>
                  <h3 className="font-semibold mb-1">Instructions:</h3>
                  <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: recipeDetails.instructions || 'No instructions.' }} />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionPage;