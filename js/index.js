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
      // On affiche la liste correpondante au bon dropdown en fonction de son attribut
      if (selectedToggle) {
        // On ferme le dropdown déjà ouvert (le cas échéant)
        closeDropdown();
        toggle.classList.add('active');
        // On applique le bon margin sur les dropdowns
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
    // Quand on clique sur l'élément on crée un tag
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
        // Si valeur dans l'input de recherche, on lance la recherche principale
        if (searchInput.value.length > 2) {
          mainSearchDisplay();
        }
      });
      // On filtre les recettes en fonction des tags
      searchFilter();
      // On vide la valeur de l'input de reherche du dropdown
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
  // On filtre en fonction du mot tapé
  arr.forEach((word) => {
    if (word.toUpperCase().indexOf(searchedString.toUpperCase()) !== -1) {
      // eslint-disable-next-line no-param-reassign
      container.innerHTML += `<li class="option" data-type="${type}">${word}</li>`;
    }
  });
  // On affiche une message d'erreur si pas de résultat
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
  // On récupère la valeur des tags
  document.querySelectorAll('.element-result p').forEach((tag) => {
    const tagValues = tag.textContent;
    tagValuesArr.push(tagValues);
  });
  // On récupère les id des recettes affichées
  const integerId = displayedRecipesId.map((el) => parseInt(el, 10));
  // On filtre les recettes en fonction des id
  const filteredRecipesId = recipes.filter((v) => integerId.includes(v.id));
  // On filtre les éléments en fonction des recettes filtrées
  createDropdownElt(filteredRecipesId);
  // On retire les éléments déjà présents dans les tags sélectionnés
  const filteredIngredientList = ingredientList.filter((v) => !tagValuesArr.includes(v));
  ingredientList = filteredIngredientList;
  const filteredApplianceList = applianceList.filter((v) => !tagValuesArr.includes(v));
  applianceList = filteredApplianceList;
  const filteredUtensilist = utensilList.filter((v) => !tagValuesArr.includes(v));
  utensilList = filteredUtensilist;
  // On affiche les éléments et on crée les tags si on clique dessus
  displayDropdownElements();
  dropdownResultDisplay();
};

// Filtrer les recettes en fonctions des tags sélectionnés
const filterRecipesByTags = (recipesToFilter) => {
  let filtered = [...recipesToFilter];
  // On récupère la valeur des tags
  document.querySelectorAll('.element-result p').forEach((tag) => {
    const tagValue = tag.textContent.toUpperCase();
    // On filtre les recettes en fonction de la valeur des tags
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
  // Si on supprime un tag, on filtre à partir de toutes les recettes
  if (remove) {
    newRecipes = [...recipes];
  }
  displayedRecipesId = [];
  // On fait une copie des recettes qui peuvent déjà être filtrés par un tag ou recherche principale
  let filteredRecipes = [...newRecipes];
  filteredRecipes = [...filterRecipesByTags(filteredRecipes)];
  // On affiche les recettes filtrées
  recipesDisplay(filteredRecipes);
  // On actualise les recettes filtrées
  newRecipes = filteredRecipes;
  // On récupère les id des recettes pour afficher le contenu actualisé dans les dropdowns
  document.querySelectorAll('.card-recipe').forEach((card) => {
    displayedRecipesId.push(card.dataset.id);
    displayFilteredList();
  });
};

// Recherche principale

// Filtrer la liste des dropdowns en fonction des recettes affichées pour la recherche principale
const filteredDropdownMainSearch = () => {
  ingredientList = [];
  applianceList = [];
  utensilList = [];
  // On filtre les recettes en fonction des id
  const integerId = displayedRecipesId.map((el) => parseInt(el, 10));
  const filteredRecipesId = recipes.filter((v) => integerId.includes(v.id));
  // On filtre les éléments en fonction des recettes filtrées
  createDropdownElt(filteredRecipesId);
  // On affiche les éléments et on crée les tags si on clique dessus
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

const mainSearchDisplay = (remove = false) => {
  // On fait une copie des recettes qui peuvent déjà être filtrées par une recherche précédente
  let filteredRecipes = [...newRecipes];
  // Si on efface la valeur, on filtre à partir de toutes les recettes
  if (remove) {
    newRecipes = [...recipes];
    filteredRecipes = newRecipes;
  }
  // On filtre les recettes en fonction de la valeur et des recettes déjà filtrées
  filteredRecipes = [...mainSearchFilter(filteredRecipes)];
  // On affiche les recettes ou le message d'erreur, le cas échéant
  recipesDisplay(filteredRecipes);
  noResultDisplay(filteredRecipes);
  // On actualise les recettes filtrées
  newRecipes = filteredRecipes;
  // On récupère les id des recettes pour afficher le contenu actualisé dans les dropdowns
  document.querySelectorAll('.card-recipe').forEach((card) => {
    displayedRecipesId.push(card.dataset.id);
    filteredDropdownMainSearch();
  });
};

// On filtre les recettes en fonction de la valeur de l'input
const mainSearchFilter = (recipesToFilter) => {
  const searchedstr = normalize(searchInput.value).toUpperCase();
  const filtered = [...recipesToFilter]
    .filter((recipe) => normalize(recipe.name.toUpperCase())
      .includes(searchedstr)
|| normalize(recipe.description.toUpperCase()).includes(searchedstr)
|| recipe.ingredients.some((elt) => normalize(elt.ingredient.toUpperCase())
  .includes(searchedstr)));
  return filtered;
};

searchInput.addEventListener('input', (e) => {
  displayedRecipesId = [];
  if (e.target.value.length >= 3) {
    // On vérifie si l'utilisateur retire du texte
    if (e.target.value.length < Number(inputValueLength.join(''))) {
      mainSearchDisplay(true);
      // On vérifie s'il y a des tags sélectionnés et on filtre en fonction des tags
      if (tagValuesArr.length > 0) {
        searchFilter();
      }
    }
    mainSearchDisplay();
  } else if (e.target.value.length < 3 && tagValuesArr.length === 0) {
    newRecipes = [...recipes];
    // On affiche toutes les recettes
    recipesDisplay(newRecipes);
    // On crée les éléments du dropdown à partir de toutes les recettes
    createDropdownElt(newRecipes);
    // On affiche les éléments du dropdown
    displayDropdownElements();
    // On crée un tag si on clique sur un élement du dropdown
    dropdownResultDisplay();
  } else if (e.target.value.length < 3 && tagValuesArr.length > 0) {
    newRecipes = [...recipes];
    searchFilter();
  }
  inputValueLength = [];
  inputValueLength.push(e.target.value.length);
});
