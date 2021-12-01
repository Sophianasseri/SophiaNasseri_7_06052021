/* eslint-disable no-use-before-define */
/* eslint-disable import/extensions */
import recipes from './recipes.js';
import { normalizeTag } from './functions.js';
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

let ingredientList = [];
let applianceList = [];
let utensilList = [];
let displayedRecipesId = [];

// Générer le contenu des dropdowns dynamiquement en fonction des recettes affichées
const dropdownListDisplay = (arr) => {
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

// Déstructuration des ingrédients
const displayIngQuantity = (elt) => {
  const { ingredient, quantity, unit } = elt;
  return `<span class="bold">${ingredient}</span> ${quantity ? `: ${quantity}` : ''} ${unit || ''}`;
};

const displayIngredient = (elt) => {
  const { ingredient } = elt;
  return `${ingredient}`;
};
// Générer les cartes dynamiquement
const recipesDisplay = () => {
  recipesContainer.innerHTML = recipes.map((recipe) => {
    const ingredientsQuantity = [];
    const normalizeIngredientArr = [];
    const normalizeAppliance = (normalizeTag(recipe.appliance));
    const normalizeUtensilArr = [];
    let normalizeUtensil;
    recipe.ustensils.forEach((elt) => {
      normalizeUtensil = normalizeTag(elt);
      normalizeUtensilArr.push(normalizeUtensil);
    });
    for (let i = 0; i < recipe.ingredients.length; i += 1) {
      normalizeIngredientArr.push(normalizeTag(displayIngredient(recipe.ingredients[i])));
    }
    for (let i = 0; i < recipe.ingredients.length; i += 1) {
      ingredientsQuantity.push(`<li>${displayIngQuantity(recipe.ingredients[i])}</li>`);
    }
    return `
      <article class="card-recipe" data-id="${recipe.id}" data-value="${normalizeIngredientArr}, ${normalizeAppliance}, ${normalizeUtensilArr}">
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

dropdownListDisplay(recipes);

// Afficher les éléments sans répétiton
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

//   Ouverture et fermeture des dropdowns
const closeDropdown = () => {
  applianceBtn.classList.remove('margin-appliance');
  utensilBtn.classList.remove('margin-utensil');
  toggleLists.forEach((toggleList) => toggleList.classList.remove('active'));
};

closeDropdownBtn.forEach((btn) => {
  btn.addEventListener('click', closeDropdown);
});

dropdowns.forEach((dropdown) => {
  dropdown.addEventListener('click', (e) => {
    toggleLists.forEach((toggleList) => {
      const toggle = toggleList;
      const toggleData = toggle.dataset.type;
      const selectedToggle = toggleData.includes(e.target.dataset.type);
      if (selectedToggle) {
        toggle.classList.add('active');
      } else if (ingredientToggle.classList.contains('active')) {
        applianceBtn.classList.add('margin-appliance');
      } else if (applianceToggle.classList.contains('active')) {
        utensilBtn.classList.add('margin-utensil');
      } else {
        closeDropdown();
      }
    });
  });
});

// Rechercher dans le dropdown
const searchIngredient = (searchedString) => {
  const uniqueIngredientList = [...new Set(ingredientList)];
  ingredientListContainer.innerHTML = '';
  uniqueIngredientList.forEach((word) => {
    if (word.toUpperCase().indexOf(searchedString.toUpperCase()) !== -1) {
      ingredientListContainer.innerHTML += `<li class="option" data-type="ingredient">${word}</li>`;
    }
  });
};
const searchAppliance = (searchedString) => {
  const uniqueApplianceList = [...new Set(applianceList)];
  applianceListContainer.innerHTML = '';
  uniqueApplianceList.forEach((word) => {
    if (word.toUpperCase().indexOf(searchedString.toUpperCase()) !== -1) {
      applianceListContainer.innerHTML += `<li class="option" data-type="appliance">${word}</li>`;
    }
  });
};

const searchUtensil = (searchedString) => {
  const uniqueUtensilList = [...new Set(utensilList)];
  utensilListContainer.innerHTML = '';
  uniqueUtensilList.forEach((word) => {
    if (word.toUpperCase().indexOf(searchedString.toUpperCase()) !== -1) {
      utensilListContainer.innerHTML += `<li class="option" data-type="utensil">${word}</li>`;
    }
  });
};

ingredientSearch.addEventListener('input', (e) => {
  searchIngredient(e.target.value);
  dropdownResultDisplay();
});
applianceSearch.addEventListener('input', (e) => {
  searchAppliance(e.target.value);
  dropdownResultDisplay();
});

utensilSearch.addEventListener('input', (e) => {
  searchUtensil(e.target.value);
  dropdownResultDisplay();
});

// Filtrer le contenu du dropdown en fonction des recettes affichées
const displayFilteredList = () => {
  const tagValuesArr = [];
  ingredientList = [];
  applianceList = [];
  utensilList = [];
  document.querySelectorAll('.element-result p').forEach((tag) => {
    const tagValues = tag.textContent;
    tagValuesArr.push(tagValues);
  });
  const integerId = displayedRecipesId.map((el) => parseInt(el, 10));
  const filteredRecipesId = recipes.filter((v) => integerId.includes(v.id));
  dropdownListDisplay(filteredRecipesId);
  const filteredIngredientList = ingredientList.filter((v) => !tagValuesArr.includes(v));
  ingredientList = filteredIngredientList;
  const filteredApplianceList = applianceList.filter((v) => !tagValuesArr.includes(v));
  applianceList = filteredApplianceList;
  const filteredUtensilist = utensilList.filter((v) => !tagValuesArr.includes(v));
  utensilList = filteredUtensilist;
  displayDropdownElements();
  dropdownResultDisplay();
};

// Afficher les recettes en fonction des tags sélectionnés
const searchFilter = () => {
  const tagValuesArr = [];
  displayedRecipesId = [];
  document.querySelectorAll('.element-result p').forEach((tag) => {
    const tagValues = tag.textContent;
    tagValuesArr.push(tagValues);
  });
  document.querySelectorAll('.card-recipe').forEach((card) => {
    const elt = card;
    if (tagValuesArr.length > 0 && tagValuesArr.every((v) => elt.dataset.value.includes(v))) {
      elt.style.display = 'block';
      displayedRecipesId.push(elt.dataset.id);
      displayFilteredList();
    } else if (tagValuesArr.length > 0
      && !tagValuesArr.every((v) => elt.dataset.value.includes(v))) {
      elt.style.display = 'none';
    } else if (tagValuesArr.length === 0) {
      elt.style.display = 'block';
      dropdownListDisplay(recipes);
      displayDropdownElements();
      dropdownResultDisplay();
    }
  });
};

// Générer un tag en fonction de l'élément cliqué
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
      // Supprimer le filtre
      filterResultsDiv.querySelector('.remove-result').addEventListener('click', () => {
        filterResultsDiv.remove();
        searchFilter();
      });
      searchFilter();
    });
  });
};

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
dropdownResultDisplay();
