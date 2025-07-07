import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUtensils, FaPlus, FaTrash } from 'react-icons/fa';
import Modal from '../components/Common/Modal';

const SPOONACULAR_API_KEY = '14c68bc2a797419190f06bec4f70e3b5';

const aiTips = [
  "Eat a variety of foods to ensure balanced nutrition.",
  "Stay hydrated—drink at least 8 glasses of water daily.",
  "Include lean proteins, whole grains, and healthy fats in your meals.",
  "Limit processed foods and added sugars.",
  "Plan your meals ahead to avoid unhealthy choices."
];
const LOCAL_STORAGE_KEY = 'calorie_tracker_entries';
const MEAL_PLAN_STORAGE_KEY = 'meal_plan_entries';
const CALORIE_LIMIT_KEY = 'daily_calorie_limit';

// --- CalorieTracker Component ---
const CalorieTracker = ({ dailyLimit, setDailyLimit, onTotalCaloriesChange }) => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ food: '', calories: '' });
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setEntries(parsed);
      calculateTotal(parsed);
    }
  }, []);

  const calculateTotal = (entries) => {
    const total = entries.reduce((sum, entry) => sum + Number(entry.calories), 0);
    setTotalCalories(total);
    onTotalCaloriesChange(total, 'tracker');
  };

  const saveEntries = (newEntries) => {
    setEntries(newEntries);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newEntries));
    calculateTotal(newEntries);
  };

  const handleAddEntry = () => {
    if (newEntry.food && newEntry.calories) {
      const updatedEntries = [...entries, newEntry];
      saveEntries(updatedEntries);
      setNewEntry({ food: '', calories: '' });
    }
  };

  const handleDeleteEntry = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    saveEntries(updatedEntries);
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden h-full mb-8">
      <div className="bg-green-900/30 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <FaUtensils className="text-xl text-green-400 mr-3" />
          <h2 className="text-xl font-semibold text-white">Calorie Tracker</h2>
        </div>
        <div className="text-white">
          Total: <span className="font-bold">{totalCalories}</span> / {dailyLimit}
        </div>
      </div>
      <div className="p-6">
        <div className="flex mb-4 space-x-2">
          <input
            type="text"
            placeholder="Food"
            value={newEntry.food}
            onChange={(e) => setNewEntry({ ...newEntry, food: e.target.value })}
            className="flex-1 bg-gray-700 border border-gray-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            placeholder="Calories"
            value={newEntry.calories}
            onChange={(e) => setNewEntry({ ...newEntry, calories: e.target.value })}
            className="w-24 bg-gray-700 border border-gray-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleAddEntry}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center"
          >
            <FaPlus />
          </button>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="text-gray-400 text-center py-4">No entries yet</div>
          ) : (
            entries.map((entry, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-700/50 p-3 rounded">
                <div>
                  <div className="font-medium text-white">{entry.food}</div>
                  <div className="text-sm text-gray-300">{entry.calories} calories</div>
                </div>
                <button
                  onClick={() => handleDeleteEntry(index)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700">
          <label className="block text-gray-300 mb-2">Daily Calorie Limit:</label>
          <input
            type="number"
            value={dailyLimit}
            onChange={(e) => {
              const newLimit = Number(e.target.value);
              setDailyLimit(newLimit);
              localStorage.setItem(CALORIE_LIMIT_KEY, newLimit.toString());
            }}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
      <Modal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} type="warning">
        <h3 className="text-xl font-bold text-yellow-600 mb-2">Calorie Limit Exceeded</h3>
        <p className="text-gray-700">
          You've exceeded your daily calorie limit of {dailyLimit} by {totalCalories - dailyLimit} calories.
        </p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setShowLimitModal(false)}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded"
          >
            Continue Anyway
          </button>
        </div>
      </Modal>
    </div>
  );
};
// --- End CalorieTracker ---

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
  const [dailyLimit, setDailyLimit] = useState(() => {
    const saved = localStorage.getItem(CALORIE_LIMIT_KEY);
    return saved ? Number(saved) : 2000;
  });
  const [trackerCalories, setTrackerCalories] = useState(0);
  const [mealPlanCalories, setMealPlanCalories] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const totalCalories = trackerCalories + mealPlanCalories;

  useEffect(() => {
    const savedMealPlan = localStorage.getItem(MEAL_PLAN_STORAGE_KEY);
    if (savedMealPlan) {
      setMealPlan(JSON.parse(savedMealPlan));
      calculateMealPlanCalories(JSON.parse(savedMealPlan));
    }
  }, []);

  useEffect(() => {
    if (totalCalories > dailyLimit) {
      setShowLimitModal(true);
    }
  }, [totalCalories, dailyLimit]);

  const calculateMealPlanCalories = (mealPlan) => {
    const total = mealPlan.reduce((sum, recipe) => {
      const cal = recipe.nutrition?.nutrients?.find(n => n.name === "Calories");
      return sum + (cal ? cal.amount : 0);
    }, 0);
    setMealPlanCalories(total);
  };

  const handleCaloriesChange = (calories, source) => {
    if (source === 'tracker') {
      setTrackerCalories(calories);
    } else if (source === 'mealPlan') {
      setMealPlanCalories(calories);
    }
  };

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

  const addToMealPlan = (recipe) => {
    const newMealPlan = [...mealPlan, recipe];
    setMealPlan(newMealPlan);
    localStorage.setItem(MEAL_PLAN_STORAGE_KEY, JSON.stringify(newMealPlan));
    calculateMealPlanCalories(newMealPlan);
    
    // Check if adding this recipe exceeds the limit
    const recipeCalories = recipe.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount || 0;
    if (totalCalories + recipeCalories > dailyLimit) {
      setShowLimitModal(true);
    }
  };

  const removeFromMealPlan = (idx) => {
    const newMealPlan = mealPlan.filter((_, i) => i !== idx);
    setMealPlan(newMealPlan);
    localStorage.setItem(MEAL_PLAN_STORAGE_KEY, JSON.stringify(newMealPlan));
    calculateMealPlanCalories(newMealPlan);
  };

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

  const handleCloseModal = () => {
    setSelectedRecipe(null);
    setRecipeDetails(null);
  };

  return (
    <div className="min-h-screen bg-black pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4 mb-8"
        >
          <span className="text-3xl"></span>
          <h1 className="text-3xl font-bold text-white">Nutrition & Meal Planner</h1>
        </motion.div>

        {/* Combined Calorie Display */}
        <div className="bg-indigo-900/30 rounded-xl p-4 mb-6 flex justify-between items-center">
          <div className="text-white text-lg">
            <span className="font-bold">Daily Total:</span> {totalCalories} / {dailyLimit} calories
          </div>
          <div className="w-1/2 bg-gray-700 rounded-full h-4">
            <div 
              className={`h-4 rounded-full ${totalCalories > dailyLimit ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(100, (totalCalories / dailyLimit) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Calorie Tracker */}
        <CalorieTracker 
          dailyLimit={dailyLimit} 
          setDailyLimit={setDailyLimit}
          onTotalCaloriesChange={handleCaloriesChange}
        />

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* AI Tip Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-900/20 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">AI-Powered Nutrition Tip</h2>
              <span className="text-xs bg-blue-700 text-blue-100 px-2 py-1 rounded-full">NEW</span>
            </div>
            <p className="text-gray-200 mb-4">{tip}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              onClick={() => setTip(aiTips[Math.floor(Math.random() * aiTips.length)])}
            >
              Get Another Tip
            </motion.button>
          </motion.div>

          {/* Search Recipes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-950 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Search Recipes</h2>
            <form onSubmit={searchRecipes} className="flex mb-4">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for recipes..."
                className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-r-lg"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>
            {error && <div className="text-red-400 mb-2">{error}</div>}
          </motion.div>
        </div>

        {/* Recipe Results */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 bg-gray-950 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Recipe Results</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {results.map((recipe, idx) => (
                <div key={recipe.id} className="bg-gray-700/50 rounded-lg p-4 flex">
                  {recipe.image && (
                    <img 
                      src={recipe.image} 
                      alt={recipe.title} 
                      className="w-20 h-20 rounded-lg object-cover mr-4"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{recipe.title}</h3>
                    <div className="text-sm text-gray-300 mt-1">
                      <span className="bg-blue-900/50 px-2 py-1 rounded mr-2">
                        Calories: {recipe.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount || 'N/A'}
                      </span>
                      <span className="bg-purple-900/50 px-2 py-1 rounded">
                        Protein: {recipe.nutrition?.nutrients?.find(n => n.name === "Protein")?.amount || 'N/A'}g
                      </span>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <button
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                        onClick={() => fetchRecipeDetails(recipe.id, recipe)}
                      >
                        View Details
                      </button>
                      <button
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                        onClick={() => addToMealPlan(recipe)}
                      >
                        Add to Plan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Meal Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-950 rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Today's Meal Plan</h2>
          {mealPlan.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No recipes added yet.</div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {mealPlan.map((recipe, idx) => (
                  <div key={idx} className="bg-gray-700/50 rounded-lg p-4 flex">
                    {recipe.image && (
                      <img 
                        src={recipe.image} 
                        alt={recipe.title} 
                        className="w-20 h-20 rounded-lg object-cover mr-4"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{recipe.title}</h3>
                      <div className="text-sm text-gray-300 mt-1">
                        <span className="bg-blue-900/50 px-2 py-1 rounded mr-2">
                          Calories: {recipe.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount || 'N/A'}
                        </span>
                        <span className="bg-purple-900/50 px-2 py-1 rounded">
                          Protein: {recipe.nutrition?.nutrients?.find(n => n.name === "Protein")?.amount || 'N/A'}g
                        </span>
                      </div>
                      <button
                        className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                        onClick={() => removeFromMealPlan(idx)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-indigo-900/30 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Nutrition Totals</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{totals.calories.toFixed(0)}</div>
                    <div className="text-sm text-gray-300">Calories</div>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{totals.protein.toFixed(1)}g</div>
                    <div className="text-sm text-gray-300">Protein</div>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">{totals.fat.toFixed(1)}g</div>
                    <div className="text-sm text-gray-300">Fat</div>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">{totals.carbs.toFixed(1)}g</div>
                    <div className="text-sm text-gray-300">Carbs</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Recipe Details Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-white">{selectedRecipe.title}</h2>
                  <button
                    className="text-gray-400 hover:text-white"
                    onClick={handleCloseModal}
                  >
                    ✕
                  </button>
                </div>
                
                {detailsLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : recipeDetails ? (
                  <>
                    {recipeDetails.image && (
                      <img 
                        src={recipeDetails.image} 
                        alt={recipeDetails.title} 
                        className="w-full h-64 object-cover rounded-lg mb-6"
                      />
                    )}
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="font-semibold text-white mb-3">Ingredients:</h3>
                        <ul className="space-y-2">
                          {recipeDetails.extendedIngredients.map((ing, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2"></span>
                              <span className="text-gray-200">{ing.original}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-white mb-3">Nutrition Info:</h3>
                        {recipeDetails.nutrition && recipeDetails.nutrition.nutrients ? (
                          <div className="space-y-2">
                            {recipeDetails.nutrition.nutrients.slice(0, 6).map((nutrient, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span className="text-gray-300">{nutrient.name}</span>
                                <span className="text-white font-medium">
                                  {nutrient.amount} {nutrient.unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400">Nutrition information not available</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-white mb-3">Instructions:</h3>
                      {recipeDetails.instructions ? (
                        <div 
                          className="prose prose-invert max-w-none text-gray-300"
                          dangerouslySetInnerHTML={{ __html: recipeDetails.instructions }}
                        />
                      ) : (
                        <p className="text-gray-400">No instructions available.</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    Failed to load recipe details.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Calorie Limit Exceeded Modal */}
        <Modal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} type="warning">
          <h3 className="text-xl font-bold text-yellow-600 mb-2">Calorie Limit Exceeded</h3>
          <p className="text-gray-700">
            You've exceeded your daily calorie limit of {dailyLimit} by {totalCalories - dailyLimit} calories.
            <br />
            (Tracker: {trackerCalories} + Meal Plan: {mealPlanCalories} = {totalCalories})
          </p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowLimitModal(false)}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded"
            >
              Continue Anyway
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default NutritionPage;