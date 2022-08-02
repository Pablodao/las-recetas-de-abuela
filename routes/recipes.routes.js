const router = require("express").Router();
const Recipe = require("../models/Recipe.model.js");
const {isLoggedIn} = require("../middlewares/auth.js")

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
router.get("/create", isLoggedIn, (req, res, next) => {
  res.render("recipes/new-recipe.hbs");
});
//POST "/recipes/create" => Creates a recipe in the DB and redirect
router.post("/create", isLoggedIn, async (req, res, next) => {
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
      creator:req.session.user._id
    });
    res.redirect(`/recipes/${newRecipe._id}`);
  } catch (err) {
    next(err);
  }
});



//POST "/recipes/:recipeId/ingredients" => Adds a new ingredient and redirect
router.post("/:recipeId/ingredients", async (req, res, next) => {
  const { recipeId } = req.params;
  const { ingredients } = req.body;
  try {
    await Recipe.findByIdAndUpdate(recipeId, {$addToSet: {ingredients} } );
    res.redirect(`/recipes/${recipeId}`);
  } catch (err) {
    next(err);
  }
});

//POST "/recipes/:recipeId/ingredients/edit" => Adds a new ingredient and redirect in edit 
router.post("/:recipeId/ingredients/edit", async (req, res, next) => {
  const { recipeId } = req.params;
  const { ingredients } = req.body;
  try {
    await Recipe.findByIdAndUpdate(recipeId, {$addToSet: {ingredients} } );
    res.redirect(`/recipes/${recipeId}/edit`);
  } catch (err) {
    next(err);
  }
});

// POST "/recipes/:recipeId/ingredient/delete" => Delete a ingredient from the DB and redirect 
router.post("/:recipeId/ingredients/delete", async (req, res, next) => {
const { recipeId } = req.params;
const { ingredients } = req.body;
try {
  await Recipe.findByIdAndUpdate(recipeId, {$pull: {ingredients} } );
  res.redirect(`/recipes/${recipeId}/edit`);
} catch (err) {
  next(err);
}
})

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
// POST "/recipes/:recipeId/delete" => Delete a recipe from the DB and redirect 
router.post("/:recipeId/delete", async (req, res, next) => {
    const{recipeId} = req.params
    try {
        await Recipe.findByIdAndDelete(recipeId)
        res.redirect("/recipes")
    } catch (err) {
        next(err)
    }
})

//GET "recipes/my-recipes" Render a view of the recipes created by the user
router.get("/my-recipes", isLoggedIn, async (req, res, next) =>{

  try{
    const myRecipes = await Recipe.find({creator:req.session.user._id}).populate("creator") 
    //condicional myRecipes esta vacío poner 
    console.log(myRecipes)
    res.render("user/my-recipes.hbs", {myRecipes})
  }catch(err){
    next(err)
  }
 
})

//POST "/recipes/isfavourite" => Update boolean isfavourite
// router.post("/isfavourite", (req, res, next) =>{
//   1. Buscar receta
//   2. Comprobar si es true o false
//   3. Actualizar isfavourite

// })

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

module.exports = router;
