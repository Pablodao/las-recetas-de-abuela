const router = require("express").Router();
const Recipe = require("../models/Recipe.model.js");


//GET "/recipes" => Render a view with all the recipes
router.get("/", async (req, res, next) => {
  try {
    const recipeList = await Recipe.find().select(
      "name, image, difficulty, category"
    );
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
  const { name, instructions, image, ingredients, difficulty, category } =
    req.body;
  try {
    await Recipe.create({
      name,
      instructions,
      image,
      ingredients,
      difficulty,
      category,
    });
    req.redirect("./recipes");
  } catch (err) {
    next(err);
  }
});

//POST "/recipes/ingredients" Adds a ingredient to the ingredients list of a recipe and redirect
router.post("/ingredient", async (req, res, next) => {

    {name}

})

//GET "/recipes/:recipeId" => Render view with all the recipe details

//GET "/recipes/:recipeId/edit" => Render edit recipe form view
//POST "/:recipeId/edit" => Edit a recipe and redirect

//POST "/recipes/:recipeId/delete" => Delete a recipe from the DB

module.exports = router;
