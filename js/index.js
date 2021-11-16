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

const ingredientList = [];
const applianceList = [];
const utensilList = [];

const displayIngQuantity = (elt) => {
  const { ingredient, quantity, unit } = elt;
  return `<span class="bold">${ingredient}</span> ${quantity ? `: ${quantity}` : ''} ${unit || ''}`;
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
// Générer le contenu des dropdowns dynamiquement
const dropdownListDisplay = async () => {
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((elt) => {
      const ingredient = normalizeTag(elt.ingredient);
      if (!ingredientList.includes(ingredient)) {
        ingredientList.push(`<li class="option" data-type="ingredient">${ingredient}</li>`);
        ingredientList.sort();
      }
    });
    const appliance = normalizeTag(recipe.appliance);
    if (!applianceList.includes(appliance)) {
      applianceList.push(`<li class="option" data-type="appliance">${appliance}</li>`);
      applianceList.sort();
    }
    recipe.ustensils.forEach((elt) => {
      const utensil = normalizeTag(elt);
      if (!utensilList.includes(utensil)) {
        utensilList.push(`<li class="option" data-type="utensil">${utensil}</li>`);
        utensilList.sort();
      }
    });
  });
};

// Dropdowns
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
//   Afficher l'élément cliqué en tant que filtre sélectionné
const dropdownResultDisplay = async () => {
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
    });
  });
};

//   Supprimer le filtre
const removeFilterResult = () => {
  const removeResultBtn = document.querySelectorAll('.remove-result');
  removeResultBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
    });
  });
};


// Rechercher dans le dropdown
const searchIngredient = (result) => {
  ingredientListContainer.innerHTML = '';
  uniqueIngredientList.map((word) => {
    if (word.toUpperCase().indexOf(result.toUpperCase()) !== -1) {
      ingredientListContainer.innerHTML = `<li class="option" data-type="ingredient">${word}</li>`;
    }
  });
};

const displayIngredientResult = async () => {
  ingredientSearch.addEventListener('input', (e) => { searchIngredient(e.target.value); });
};

dropdownListDisplay().then(() => {
  displayIngredientResult().then(() => {
    dropdownResultDisplay().then(() => {
      removeFilterResult();
    });
  });
});

// Afficher les éléments sans répétiton
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
