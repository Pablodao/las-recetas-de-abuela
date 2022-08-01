const router = require("express").Router();
const Recipe = require("../models/Recipe.model.js");

//GET "/recipes" => Render a view with all the recipes
router.get("/", async (req, res, next) => {
  try {
    const recipeList = await Recipe.find();

    res.render("recipes/list.hbs", { recipeList });
  } catch (err) {
    next(err);
  }
});

//GET "/recipes/create" => Render create recipe form view
router.get("/create", (req, res, next) => {
  res.render("recipes/new-recipe.hbs");
});
//POST "/recipes/create" => Creates a recipe in the DB and redirect
router.post("/create", async (req, res, next) => {
  const {
    name,
    instructions,
    image,
    ingredients,
    preparationtime,
    difficulty,
    category,
  } = req.body;
  try {
    const newRecipe = await Recipe.create({
      name,
      instructions,
      image,
      ingredients,
      preparationtime,
      difficulty,
      category,
    });
    res.redirect(`/recipes/${newRecipe._id}`);
  } catch (err) {
    next(err);
  }
});

// GET "/recipes/:recipeId" => Render view with all the recipe details
router.get("/:recipeId", async (req, res, next) => {
  const { recipeId } = req.params;
  try {
    const selectedRecipe = await Recipe.findById(recipeId);
    res.render("recipes/details.hbs", { selectedRecipe });
  } catch (err) {
    next(err);
  }
});

//POST "/recipes/:recipeId/ingredients" => Adds a new ingredient and redirect
router.post("/:recipeId/ingredients", async (req, res, next) => {
  const { recipeId } = req.params;
  const { ingredients } = req.body;
  try {
    await Recipe.findByIdAndUpdate(recipeId, { ingredients });
    res.redirect(`/recipes/${recipeId}`);
  } catch (err) {
    next(err);
  }
});

// GET "/recipes/:recipeId/edit" => Render edit recipe form view
router.get("/:recipeId/edit", async (req, res, next) => {
  const { recipeId } = req.params;
    console.log(recipeId)
  try {
    const selectedRecipe = await Recipe.findById(recipeId);
    res.render("recipes/edit", { selectedRecipe });
  } catch (err) {
    next(err);
  }
});

// POST "/:recipeId/edit" => Edit a recipe and redirect
router.post("/:recipeId/edit", async (req, res, next) => {
  const { recipeId } = req.params;
  const {
    name,
    instructions,
    image,
    ingredients,
    preparationtime,
    difficulty,
    category,
  } = req.body;
  try {
  await Recipe.findByIdAndUpdate(recipeId, {
      name,
      instructions,
      image,
      ingredients,
      preparationtime,
      difficulty,
      category,
    });
    
    res.redirect(`/recipes/${recipeId}`);
  } catch (err) {
    next(err);
  }
});
// POST "/recipes/:recipeId/delete" => Delete a recipe from the DB

module.exports = router;
