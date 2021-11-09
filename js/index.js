// eslint-disable-next-line import/extensions
import recipes from './recipes.js';

// Eléments DOM
const recipesContainer = document.querySelector('.recipes');
const ingredientListContainer = document.querySelector('#menu-ingredient');
const applianceListContainer = document.querySelector('#menu-appliance');
const utensilListContainer = document.querySelector('#menu-utensil');

const ingredientList = [];

const displayIngQuantity = (elt) => {
  const { ingredient, quantity, unit } = elt;
  return `${ingredient} ${quantity ? `: ${quantity}` : ''} ${unit || ''}`;
};
// Générer les cartes dynamiquement
const recipesDisplay = () => {
  recipesContainer.innerHTML = recipes.map((recipe) => {
    const ingredientsQuantity = [];
    for (let i = 0; i < recipe.ingredients.length; i += 1) {
      ingredientsQuantity.push(`<li>${displayIngQuantity(recipe.ingredients[i])}</li>`);
    }
    return `
      <article class="card-recipe">
      <div class="image-placeholder"></div>
      <div class="card-text">
        <div class="recipe-info">
          <h2>${recipe.name}</h2>
          <div class="recipe-time">
            <i class="far fa-clock"></i>
            <p>${recipe.time} min</p>
          </div>
        </div>
        <div class="recipe-description">
          <ul>
           ${ingredientsQuantity.join('')}
          </ul>
          <p>${recipe.description}</p>
        </div>
      </div>
    </article>`;
  }).join('');
};

recipesDisplay();

const lowerCase = (string) => string.toLowerCase();

recipes.forEach((recipe) => {
  recipe.ingredients.forEach((elt) => {
    const ingredient = lowerCase(elt.ingredient);
    if (!ingredientList.includes(ingredient)) {
      ingredientList.push(`<li>${ingredient}</li>`);
      ingredientList.sort();
    }
  });
});
const uniqueIngredientList = [...new Set(ingredientList)];
ingredientListContainer.innerHTML = `
<ul>
${uniqueIngredientList.join('')}
</ul>`;
