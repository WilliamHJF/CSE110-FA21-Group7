function updateRecipe(id) {
  const recipe = findRecipe(id);

  const title = document.getElementById("recipeTitle");
  const ingredient1Name = document.getElementById("ingredient1name");
  const ingredient1Amount = document.getElementById("ingredient1amount");
  const step1 = document.getElementById("step1");

  title.value = recipe.title;
  const ingredients = recipe.ingredients;
  const ingredient1 = ingredients[0];
  ingredient1Name.value = ingredient1.name;
  ingredient1Amount.value = ingredient1.amount;

  const steps = recipe.steps;
  step1 = steps[0];
  step1.value = step1;

  createRecipe();
}
// update-recipe.js

const MAX_INGREDIENTS = 20;
const MAX_STEPS = 10;

let recipes = {};
const recipe = {};
let formdata = new FormData();
window.addEventListener("DOMContentLoaded", init);

/** Initialize function, begins all of the JS code in this file */
async function init() {
  console.log("Initializing");
  initializeStorage();
  checkID();
  setFormListener();
}

/** Checks if ID is in localStorage */
function checkID() {
  const queryString = window.location.search;
  // console.log(queryString);
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");
  if (id === null) {
    console.log("No id parameter");
    return;
  }
  console.log(`id: ${id}`);
  populateForm(id);
}

// TODO: Finish populateForm
/** Populate forms by ID
 * @param {int} id
 */
function populateForm(id) {
  let recipe;
  if (id in recipes) {
    recipe = recipes[id];
    console.log(`Found recipe: ${recipe['title']}`);
  } else {
    console.log(`ID: ${id} does not exist in recipes`);
    return;
  }
  document.getElementById('recipeTitle').value = recipe['title'];
  document.getElementById('recipeDescription').value = recipe['description'];
  document.getElementById('recipeCost').value = recipe['totalCost'];
  document.getElementById('recipeImage').src = recipe['img-url'];

  /*
  const ingredients = [];
  recipe.ingredients = ingredients;
  const ingredient1 = {};
  ingredient1.name = document.getElementById('ingredient1name').value.trim();
  ingredient1.amount = document.getElementById('ingredient1amount')
      .value.trim();
  ingredients.push(ingredient1);
  const steps = [];
  recipe.steps = steps;
  document.getElementById('step1')
  document.getElementById('step2')
  */
}



/** Initializes recipes object from localStorage cache */
function initializeStorage() {
  console.log("Initializing recipes object");
  const json = localStorage.getItem("recipes");

  if (json === null) {
    console.log("Recipes not initialized in localStorage cache");
    // Good practice to use brackets to ensure proper type
    recipes["currID"] = 1;
    localStorage.setItem("recipes", JSON.stringify(recipes));
    return;
  }

  recipes = JSON.parse(json);
  if (Object.keys(recipes).length == 0) {
    // Check properly formatted
    if (!("currID" in recipes)) {
      recipes["currID"] = 1;
    }
    console.log("Empty recipes object");
  }
}

/**  Show a message in the invalid-feedback div below the input element
 * @param {HTMLElement} input
 * @param {String} message
 * @param {Boolean} type
 * @return {Boolean}
 */
function showMessage(input, message, type) {
  // get the small element and set the message
  const msg = input.parentNode.querySelector("div.invalid-feedback");
  // console.log(msg);
  msg.innerText = message;
  // update the class for the input
  if (type) {
    // Valid
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  } else {
    // Invalid
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
  }
  return type;
}

/** Shows error message
 * @param {HTMLElement} input
 * @param {String} message
 * @return {Function}
 */
function showError(input, message) {
  return showMessage(input, message, false);
}

/**
 * Shows success message
 * @param {HTMLElement} input
 * @return {Function}
 */
function showSuccess(input) {
  return showMessage(input, "", true);
}

/**
 * Checks if an element has a non-empty value
 * @param {HTMLElement} input
 * @param {String} message
 * @return {Function}
 */
function hasValue(input, message) {
  if (input.value.trim() === "") {
    return showError(input, message);
  }
  return showSuccess(input);
}

/**
 * Checks if an element has a float value
 * @param {HTMLElement} input
 * @param {String} message
 * @return {Function}
 */
function hasFloat(input, message) {
  if (isNaN(parseFloat(input.value.trim()))) {
    return showError(input, message);
  }
  return showSuccess(input);
}

/*
function getElementIfExists(elem) {
  if (elem != null && elem.value.trim() === '') {
    return ''
  }
  return elem.value.trim()
}
*/

/**
 * Set up form event listener
 */
function setFormListener() {
  const form = document.getElementById("recipeForm");

  const TITLE_REQUIRED = "Please enter your recipe title";
  const INGREDIENT_NAME_REQUIRED = "Please enter your ingredient name";
  const INGREDIENT_AMOUNT_REQUIRED = "Please enter your ingredient amount";
  const STEP_REQUIRED = "Please enter your recipe instructions";

  // Form submission, saves recipe to localStorage
  form.addEventListener("submit", function (event) {
    // Stop form submission
    event.preventDefault();
    console.log("Submit button clicked");
    let allValid = true;

    // Validate form
    const titleValid = hasValue(
      document.getElementById("recipeTitle"),
      TITLE_REQUIRED
    );
    if (titleValid) {
      recipe["title"] = document.getElementById("recipeTitle").value.trim();
    } else {
      allValid = false;
    }

    recipe["description"] = document
      .getElementById("recipeDescription")
      .value.trim();

    const totalCost = document.getElementById("recipeCost").value.trim();
    let cost = null;
    if (totalCost.length > 0) {
      if (hasFloat(document.getElementById("recipeCost"))) {
        cost = parseFloat(totalCost);
      } else {
        allValid = false;
      }
    }
    recipe["totalCost"] = cost;

    // TODO: Upload Image

    const ingredients = [];
    const ingredientElems = document
      .getElementById("ingredients")
      .getElementsByClassName("ingredient");
    for (let i = 0; i < ingredientElems.length; i++) {
      const ingElem = ingredientElems[i];
      const recipeIng = {};
      const ingredientNameValid = hasValue(
        ingElem.querySelector(".ingredient-name > input"),
        INGREDIENT_NAME_REQUIRED
      );
      const ingredientAmountValid = hasValue(
        ingElem.querySelector(".ingredient-amount > input"),
        INGREDIENT_AMOUNT_REQUIRED
      );
      recipeIng["name"] = ingElem
        .querySelector(".ingredient-name > input")
        .value.trim();
      recipeIng["amount"] = ingElem
        .querySelector(".ingredient-amount > input")
        .value.trim();

      if (ingredientNameValid && ingredientAmountValid) {
        ingredients.push(recipeIng);
      } else {
        allValid = false;
      }
    }

    recipe["ingredients"] = ingredients;

    const steps = [];
    const stepElems = document
      .getElementById("steps")
      .getElementsByClassName("step-sec");
    for (let i = 0; i < stepElems.length; i++) {
      const stepElem = stepElems[i];
      console.log(`stepElem: ${stepElem}`);
      const stepValid = hasValue(
        stepElem.querySelector(".form-control"),
        STEP_REQUIRED
      );
      if (stepValid) {
        const step = stepElem.querySelector(".form-control").value.trim();
        steps.push(step);
      } else {
        allValid = false;
      }
    }
    recipe["steps"] = steps;

    if (allValid) {
      const id = parseInt(recipes.currID, 10);
      recipes.currID = id + 1;

      recipes[id] = recipe;
      localStorage.setItem("recipes", JSON.stringify(recipes));
    } else {
      console.log("Invalid recipe");
    }
  });

  const file = document.getElementById("recipeImage");

  // Image upload, saves URL to recipe object
  file.addEventListener("change", (e) => {
    formdata = new FormData();
    formdata.append("image", e.target.files[0]);
    // console.log(file);
    fetch("https://api.imgur.com/3/image/", {
      method: "post",
      headers: {
        Authorization: "Client-ID 1b99956c57a5642",
      },
      body: formdata,
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        const divImg = document.getElementById("img-spot");
        const childImgs = divImg.getElementsByTagName("img");
        let img;
        if (childImgs.length == 0) {
          img = document.createElement("img");
          divImg.append(img);
        } else {
          img = childImgs[0];
        }
        console.log(`URL: ${data.data.link}`);
        img.src = data.data.link;
        img.height = "200";
        img.referrerPolicy = "no-referrer";
        recipe["img-url"] = data.data.link;
      });
  });

  const addIng = form.querySelector("#add-ingredient");

  // Create additional ingredient element
  addIng.addEventListener("click", function (event) {
    console.log("Add ingredient");
    const ingsDiv = document.getElementById("ingredients");
    const ingElems = ingsDiv.querySelectorAll(".ingredient");
    const numIngs = ingElems.length;

    // Setting hard upper bound per ADR
    if (numIngs >= MAX_INGREDIENTS) {
      console.log("Maximum amount of ingredients");
      return;
    }

    const ingAdded = ingElems[0].cloneNode(true);
    ingAdded.innerText = "";
    console.log(`numIngs: ${numIngs}`);
    ingAdded.querySelector(
      ".ingredient-name > .name-label"
    ).innerText = `Ingredient ${numIngs + 1}`;
    ingsDiv.appendChild(ingAdded);
  });

  const addStep = form.querySelector("#add-step");

  // Create additional step element
  addStep.addEventListener("click", function (event) {
    console.log("Add step");
    const stepsDiv = document.getElementById("steps");
    const stepElems = stepsDiv.querySelectorAll(".step-sec");
    const numSteps = stepElems.length;

    // Setting hard upper bound per ADR
    if (numSteps >= MAX_STEPS) {
      console.log("Maximum amount of steps");
      return;
    }

    const stepAdded = stepElems[0].cloneNode(true);
    stepAdded.innerText = "";
    console.log(`numSteps: ${numSteps}`);
    stepAdded.querySelector(".recipeStep-label").innerText = `Step ${
      numSteps + 1
    }`;
    stepsDiv.appendChild(stepAdded);
  });

  const removeIng = form.querySelector("#remove-ingredient");

  removeIng.addEventListener("click", function (event) {
    console.log("Remove ingredient");
    const ingsDiv = document.getElementById("ingredients");
    const ingElems = ingsDiv.querySelectorAll(".ingredient");
    if (ingElems.length > 1) {
      ingElems[ingElems.length - 1].remove();
    }
  });

  const removeStep = form.querySelector("#remove-step");

  removeStep.addEventListener("click", function (event) {
    console.log("Remove step");
    const stepsDiv = document.getElementById("steps");
    const stepElems = stepsDiv.querySelectorAll(".step-sec");
    if (stepElems.length > 1) {
      stepElems[stepElems.length - 1].remove();
    }
  });
}
