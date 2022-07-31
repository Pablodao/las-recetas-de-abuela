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
//POST "/recipes/create" => Creates a recipe in the DB and redirect

//GET "/recipes/:recipeId" => Render view with all the recipe details

//GET "/recipes/:recipeId/edit" => Render edit recipe form view
//POST "/:recipeId/edit" => Edit a recipe and redirect

//POST "/recipes/:recipeId/delete" => Delete a recipe from the DB

module.exports = router;
