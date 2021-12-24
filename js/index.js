/* eslint-disable no-use-before-define */
/* eslint-disable import/extensions */
import recipes from './recipes.js';
import { normalizeTag, normalize } from './functions.js';
// Eléments DOM
const recipesContainer = document.querySelector('.recipes');
const ingredientListContainer = document.querySelector('#menu-ingredient');
const applianceListContainer = document.querySelector('#menu-appliance');
const utensilListContainer = document.querySelector('#menu-utensil');
const dropdowns = document.querySelectorAll('.dropdown__toggle');
const toggleLists = document.querySelectorAll('.toggle-list');
const closeDropdownBtn = document.querySelectorAll('.close-dropdown');
const applianceBtn = document.querySelector('#toggle-appliance');
const utensilBtn = document.querySelector('#toggle-utensil');
const ingredientToggle = document.querySelector('.toggle-list--ingredient');
const applianceToggle = document.querySelector('.toggle-list--appliance');
const filterResults = document.querySelector('.filter-results');
const ingredientSearch = document.querySelector('.ingredient-search');
const applianceSearch = document.querySelector('.appliance-search');
const utensilSearch = document.querySelector('.utensil-search');
const searchInput = document.querySelector('.main-search');

let ingredientList = [];
let applianceList = [];
let utensilList = [];
let tagValuesArr = [];
let displayedRecipesId = [];
let newRecipes = [...recipes];
let inputValueLength = [];

// Déstructuration des ingrédients
const displayIngQuantity = (elt) => {
  const { ingredient, quantity, unit } = elt;
  return `<span class="bold recipe-ingredient">${ingredient}</span> ${quantity ? `: ${quantity}` : ''} ${unit || ''}`;
};

// Générer et afficher les cartes dynamiquement
const recipesDisplay = (recipeData) => {
  const str = recipeData.map((recipe) => {
    const ingredientsQuantity = [];
    for (let i = 0; i < recipe.ingredients.length; i += 1) {
      ingredientsQuantity.push(`<li>${displayIngQuantity(recipe.ingredients[i])}</li>`);
    }
    return `
      <article class="card-recipe" data-id="${recipe.id}">
      <div class="image-placeholder"></div>
      <div class="card-text">
        <div class="recipe-info">
          <h2 class='recipe-title'>${recipe.name}</h2>
          <div class="recipe-time">
            <i class="far fa-clock"></i>
            <p>${recipe.time} min</p>
          </div>
        </div>
        <div class="recipe-description">
          <ul>
           ${ingredientsQuantity.join('')}
          </ul>
          <p class="recipe-steps">${recipe.description}</p>
        </div>
      </div>
    </article>`;
  }).join('');
  recipesContainer.innerHTML = str;
};

recipesDisplay(newRecipes);
// Générer le contenu des dropdowns dynamiquement en fonction des recettes affichées
const createDropdownElt = (arr) => {
  arr.forEach((recipe) => {
    recipe.ingredients.forEach((elt) => {
      const ingredient = normalizeTag(elt.ingredient);
      if (!ingredientList.includes(ingredient)) {
        ingredientList.push(`${ingredient}`);
        ingredientList.sort();
      }
    });
    const appliance = normalizeTag(recipe.appliance);
    if (!applianceList.includes(appliance)) {
      applianceList.push(`${appliance}`);
      applianceList.sort();
    }
    recipe.ustensils.forEach((elt) => {
      const utensil = normalizeTag(elt);
      if (!utensilList.includes(utensil)) {
        utensilList.push(`${utensil}`);
        utensilList.sort();
      }
    });
  });
};
createDropdownElt(newRecipes);

// Afficher les éléments sans répétiton dans les listes des dropdowns
const displayDropdownElements = () => {
  const uniqueIngredientList = [...new Set(ingredientList)];
  ingredientListContainer.innerHTML = `
  
  ${uniqueIngredientList.map((ingredient) => `<li class="option" data-type="ingredient">${ingredient}</li>`).join('')}
   `;
  const uniqueApplianceList = [...new Set(applianceList)];
  applianceListContainer.innerHTML = `
  ${uniqueApplianceList.map((appliance) => `<li class="option" data-type="appliance">${appliance}</li>`).join('')}
   `;

  const uniqueUtensilList = [...new Set(utensilList)];
  utensilListContainer.innerHTML = `
  ${uniqueUtensilList.map((utensil) => `<li class="option" data-type="utensil">${utensil}</li>`).join('')}
`;
};

displayDropdownElements();

// Fermer le dropdown
const closeDropdown = () => {
  applianceBtn.classList.remove('margin-appliance');
  utensilBtn.classList.remove('margin-utensil');
  toggleLists.forEach((toggleList) => toggleList.classList.remove('active'));
};

closeDropdownBtn.forEach((btn) => {
  btn.addEventListener('click', closeDropdown);
});

// Ouvrir le dropdown
dropdowns.forEach((dropdown) => {
  dropdown.addEventListener('click', (e) => {
    toggleLists.forEach((toggleList) => {
      const toggle = toggleList;
      const toggleData = toggle.dataset.type;
      const selectedToggle = toggleData.includes(e.target.dataset.type);
      if (selectedToggle) {
        closeDropdown();
        toggle.classList.add('active');
      } else if (ingredientToggle.classList.contains('active')) {
        applianceBtn.classList.add('margin-appliance');
      } else if (applianceToggle.classList.contains('active')) {
        utensilBtn.classList.add('margin-utensil');
      }
    });
  });
});

// Générer un tag en fonction de l'élément cliqué dans la liste du dropdown
const dropdownResultDisplay = () => {
  const dropdownElements = document.querySelectorAll('.option');
  dropdownElements.forEach((element) => {
    element.addEventListener('click', (e) => {
      closeDropdown();
      const filterResultsDiv = document.createElement('div');
      filterResults.appendChild(filterResultsDiv);
      filterResultsDiv.classList.add('element-result');
      const listContent = element.textContent;
      const listDataset = e.target.dataset.type;
      filterResultsDiv.setAttribute('data-type', listDataset);
      filterResultsDiv.innerHTML = `
        <p>${listContent}</p>
        <button class="remove-result"><i class="far fa-times-circle"></i></button>
      `;
      // Supprimer le tag
      filterResultsDiv.querySelector('.remove-result').addEventListener('click', () => {
        filterResultsDiv.remove();
        searchFilter(true);
        if (searchInput.value.length > 2) {
          mainSearchDisplay();
        }
      });
      searchFilter();
      if (ingredientSearch.value.length || applianceSearch.value.length
        || utensilSearch.value.length > 0) {
        ingredientSearch.value = '';
        applianceSearch.value = '';
        utensilSearch.value = '';
      }
    });
  });
};
dropdownResultDisplay();

// Rechercher dans le dropdown
const searchDropdown = (searchedString, container, arr, type) => {
  // eslint-disable-next-line no-param-reassign
  container.innerHTML = '';
  arr.forEach((word) => {
    if (word.toUpperCase().indexOf(searchedString.toUpperCase()) !== -1) {
      // eslint-disable-next-line no-param-reassign
      container.innerHTML += `<li class="option" data-type="${type}">${word}</li>`;
    }
  });
  if (container.innerHTML === '') {
    // eslint-disable-next-line no-param-reassign
    container.innerHTML = '<p>Aucun résultat</p>';
  }
};
// Afficher le résultat de la recherche dans le dropdown correpondant
ingredientSearch.addEventListener('input', (e) => {
  const uniqueIngredientList = [...new Set(ingredientList)];
  searchDropdown(e.target.value, ingredientListContainer, uniqueIngredientList, 'ingredient');
  dropdownResultDisplay();
});
applianceSearch.addEventListener('input', (e) => {
  const uniqueApplianceList = [...new Set(applianceList)];
  searchDropdown(e.target.value, applianceListContainer, uniqueApplianceList, 'appliance');
  dropdownResultDisplay();
});

utensilSearch.addEventListener('input', (e) => {
  const uniqueUtensilList = [...new Set(utensilList)];
  searchDropdown(e.target.value, utensilListContainer, uniqueUtensilList, 'utensil');
  dropdownResultDisplay();
});

// Filtrer le contenu du dropdown en fonction des recettes affichées losrqu'un tag est sélectionné
const displayFilteredList = () => {
  tagValuesArr = [];
  ingredientList = [];
  applianceList = [];
  utensilList = [];
  document.querySelectorAll('.element-result p').forEach((tag) => {
    const tagValues = tag.textContent;
    tagValuesArr.push(tagValues);
  });
  const integerId = displayedRecipesId.map((el) => parseInt(el, 10));
  const filteredRecipesId = recipes.filter((v) => integerId.includes(v.id));
  createDropdownElt(filteredRecipesId);
  const filteredIngredientList = ingredientList.filter((v) => !tagValuesArr.includes(v));
  ingredientList = filteredIngredientList;
  const filteredApplianceList = applianceList.filter((v) => !tagValuesArr.includes(v));
  applianceList = filteredApplianceList;
  const filteredUtensilist = utensilList.filter((v) => !tagValuesArr.includes(v));
  utensilList = filteredUtensilist;
  displayDropdownElements();
  dropdownResultDisplay();
};

// Filtrer les recettes en fonctions des tags sélectionnés
const filterRecipesByTags = (recipesToFilter) => {
  let filtered = [...recipesToFilter];
  document.querySelectorAll('.element-result p').forEach((tag) => {
    const tagValue = tag.textContent.toUpperCase();
    filtered = [...filtered.filter((recipe) => (
      recipe.ingredients.some((elt) => tagValue === normalize(elt.ingredient.toUpperCase()))
      || tagValue === normalize(recipe.appliance.toUpperCase())
      || recipe.ustensils.some((elt) => tagValue === normalize(elt.toUpperCase()))
    ))];
    tagValuesArr.push(tagValue);
  });
  return filtered;
};

// Afficher les recettes filtrées
const searchFilter = (remove = false) => {
  if (remove) {
    newRecipes = [...recipes];
  }
  displayedRecipesId = [];
  let filteredRecipes = [...newRecipes];
  filteredRecipes = [...filterRecipesByTags(filteredRecipes)];
  recipesDisplay(filteredRecipes);
  newRecipes = filteredRecipes;
  document.querySelectorAll('.card-recipe').forEach((card) => {
    displayedRecipesId.push(card.dataset.id);
    displayFilteredList();
  });
};

// Filtrer la liste des dropdowns en fonction des recettes recherchées
const filteredDropdownMainSearch = () => {
  ingredientList = [];
  applianceList = [];
  utensilList = [];
  const integerId = displayedRecipesId.map((el) => parseInt(el, 10));
  const filteredRecipesId = recipes.filter((v) => integerId.includes(v.id));
  createDropdownElt(filteredRecipesId);
  displayDropdownElements();
  dropdownResultDisplay();
};

// Afficher message d'erreur si pas de résultat
const noResultDisplay = (arr) => {
  if (arr.length === 0) {
    document.querySelector('.recipes-no-result').innerHTML = `
    <p>Aucune recette ne correspond à votre critère... vous pouvez chercher "tarte aux pommes", "poisson", etc.</p>
    `;
  } else {
    document.querySelector('.recipes-no-result').innerHTML = '';
  }
};

const hasIngredient = (recipe, searchedstr) => {
  for (let j = 0; j < recipe.ingredients.length; j += 1) {
    if (normalize(recipe.ingredients[j].ingredient.toUpperCase())
      .includes(searchedstr)) {
      return true;
    }
  }
  return false;
};

const mainSearchFilter = (recipesToFilter) => {
  const searchedstr = normalize(searchInput.value).toUpperCase();
  const newRecipesToFilter = [...recipesToFilter];
  const filteredRecipes = [];
  for (let i = 0; i < newRecipesToFilter.length; i += 1) {
    if (normalize(newRecipesToFilter[i].name.toUpperCase()).includes(searchedstr)
    || normalize(newRecipesToFilter[i].description.toUpperCase()).includes(searchedstr)
    || hasIngredient(newRecipesToFilter[i], searchedstr)) {
      filteredRecipes.push(newRecipesToFilter[i]);
    }
  }
  return filteredRecipes;
};

const mainSearchDisplay = (remove = false) => {
  let filteredRecipes = [...newRecipes];
  if (remove) {
    newRecipes = [...recipes];
    filteredRecipes = newRecipes;
  }
  filteredRecipes = [...mainSearchFilter(filteredRecipes)];
  recipesDisplay(filteredRecipes);
  noResultDisplay(filteredRecipes);
  newRecipes = filteredRecipes;
  for (let i = 0; i < document.querySelectorAll('.card-recipe').length; i += 1) {
    displayedRecipesId.push(document.querySelectorAll('.card-recipe')[i].dataset.id);
    filteredDropdownMainSearch();
  }
};

searchInput.addEventListener('input', (e) => {
  displayedRecipesId = [];
  if (e.target.value.length >= 3) {
    if (e.target.value.length < Number(inputValueLength.join(''))) {
      if (tagValuesArr.length > 0) {
        mainSearchDisplay(true);
        searchFilter();
      } else {
        mainSearchDisplay(true);
      }
    }
    mainSearchDisplay();
  } else if (e.target.value.length < 3 && tagValuesArr.length === 0) {
    newRecipes = [...recipes];
    recipesDisplay(newRecipes);
    createDropdownElt(newRecipes);
    displayDropdownElements();
    dropdownResultDisplay();
  } else if (e.target.value.length < 3 && tagValuesArr.length > 0) {
    newRecipes = [...recipes];
    searchFilter();
  }
  inputValueLength = [];
  inputValueLength.push(e.target.value.length);
});
