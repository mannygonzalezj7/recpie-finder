const appId = '61af4f87';
const appKey = '113e78ed58025e1422d369e4da4abd0e';

// Select DOM elements
const searchButton = document.getElementById('search-button');
const recipesContainer = document.getElementById('recipes-container');
const favoritesContainer = document.getElementById('favorites-container');

// Initialize an empty array to store favorite recipes and hide containers
let favorites = [];
console.log(favorites.length);
if(favorites.length == 0){
    document.getElementById('favorites').style.visibility = "hidden";
}

document.getElementById('recipe-results').style.visibility = "hidden";

// Event listener for the search button
searchButton.addEventListener('click', async () => {
    const ingredients = document.getElementById('ingredient-input').value;
    if (ingredients) {
        try {
            const recipes = await fetchRecipes(ingredients);
            displayRecipes(recipes);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    }

    document.getElementById('recipe-results').style.visibility = "visible";
});

// Function to fetch recipes based on ingredients
async function fetchRecipes(ingredients) {
    const response = await fetch(`https://api.edamam.com/search?q=${ingredients}&app_id=${appId}&app_key=${appKey}`);
    if (!response.ok) {
        throw new Error("Failed to fetch recipes");
    }
    const data = await response.json();
    return data.hits;
}

// Function to display recipes
function displayRecipes(recipes) {
    recipesContainer.innerHTML = ''; // Clear previous results
    recipes.forEach(recipeData => {
        const recipe = recipeData.recipe;
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        recipeCard.innerHTML = `
            <h3>${recipe.label}</h3>
            <img src="${recipe.image}" alt="${recipe.label}" style="width: 100%; height: auto;">
            <p><a href="${recipe.url}" target="_blank">View Recipe</a></p>
            <button onclick="saveToFavorites('${recipe.label}', '${recipe.image}', '${recipe.url}')">Save to Favorites</button>
        `;

        recipesContainer.appendChild(recipeCard);
    });
}

// Function to save recipes to favorites
function saveToFavorites(label, image, url) {
    document.getElementById('favorites').style.visibility = "visible";
    const existingFavorite = favorites.find(fav => fav.url === url);

    if (existingFavorite) {
        console.log("This recipe is already in your favorites!");
        return;
    }

    // If not already in favorites, add the recipe to the favorites list
    const favorite = { label, image, url };
    favorites.push(favorite);

    displayFavorites();
}

// Function to remove a recipe from favorites
function removeFromFavorites(url) {
    favorites = favorites.filter(fav => fav.url !== url);
    if (favorites.length == 0){
        document.getElementById('favorites').style.visibility = "hidden";
    }
    displayFavorites();
}

// Function to display favorite recipes
function displayFavorites() {
    favoritesContainer.innerHTML = '';
    favorites.forEach(fav => {
        const favoriteCard = document.createElement('div');
        favoriteCard.classList.add('favorite-card');

        favoriteCard.innerHTML = `
            <h3>${fav.label}</h3>
            <img src="${fav.image}" alt="${fav.label}" style="width: 100%; height: auto;">
            <p><a href="${fav.url}" target="_blank">View Recipe</a></p>
            <button class="remove-btn" onclick="removeFromFavorites('${fav.url}')">Remove</button>
        `;

        favoritesContainer.appendChild(favoriteCard);
    });
}