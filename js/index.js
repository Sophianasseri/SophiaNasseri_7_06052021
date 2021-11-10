/* eslint-disable import/extensions */
import recipes from './recipes.js';
import { normalizeTag } from './functions.js';
// Eléments DOM
const recipesContainer = document.querySelector('.recipes');
const ingredientListContainer = document.querySelector('#menu-ingredient');
const applianceListContainer = document.querySelector('#menu-appliance');
const utensilListContainer = document.querySelector('#menu-utensil');

const ingredientList = [];
const applianceList = [];
const utensilList = [];

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


recipes.forEach((recipe) => {
  recipe.ingredients.forEach((elt) => {
    const ingredient = normalizeTag(elt.ingredient);
    if (!ingredientList.includes(ingredient)) {
      ingredientList.push(`<li>${ingredient}</li>`);
      ingredientList.sort();
    }
  });
  const appliance = normalizeTag(recipe.appliance);
  if (!applianceList.includes(appliance)) {
    applianceList.push(`<li>${appliance}</li>`);
    applianceList.sort();
  }
  recipe.ustensils.forEach((elt) => {
    const utensil = normalizeTag(elt);
    if (!utensilList.includes(utensil)) {
      utensilList.push(`<li>${utensil}</li>`);
      utensilList.sort();
    }

  });
});
const uniqueIngredientList = [...new Set(ingredientList)];
ingredientListContainer.innerHTML = `

${uniqueIngredientList.join('')}
`;

const uniqueApplianceList = [...new Set(applianceList)];
applianceListContainer.innerHTML = `<ul>
${uniqueApplianceList.join('')}
</ul>`;

const uniqueUtensilList = [...new Set(utensilList)];
utensilListContainer.innerHTML = `<ul>
${uniqueUtensilList.join('')}
</ul>`;

/*
const filterIngredientsList = recipes => {
  const ingredientList = []; 
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((elt) => {
      const ingredient = normalizeTag(elt.ingredient);
      if (!ingredientList.includes(ingredient)) {
        ingredientList.push(ingredient);
        ingredientList.sort();
      }
    });
  });
  return ingredientList
} */