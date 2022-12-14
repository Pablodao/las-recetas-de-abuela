const router = require("express").Router();
const Recipe = require("../models/Recipe.model.js");
const User = require("../models/User.model.js");
const Comment = require("../models/Comment.model");
const { isLoggedIn } = require("../middlewares/auth.js");
const uploader = require("../middlewares/uploader.js");

//GET "/recipes" => Render a view with all the recipes
router.get("/", async (req, res, next) => {
  try {
    const recipeList = await Recipe.find();

    res.render("recipes/list.hbs", { recipeList });
  } catch (err) {
    next(err);
  }
});

//GET "/recipes" => Render a view with all the recipes
router.get("/category/:categoryType", async (req, res, next) => {
  const { categoryType } = req.params;


  try {
    const recipeList = await Recipe.find({ category: categoryType });

    res.render("recipes/filtered-list.hbs", { recipeList, categoryType });
  } catch (err) {
    next(err);
  }
});

//GET "/recipes/create" => Render create recipe form view
router.get("/create", isLoggedIn, (req, res, next) => {
  res.render("recipes/new-recipe.hbs");
});
//POST "/recipes/create" => Creates a recipe in the DB and redirect
router.post("/create", isLoggedIn, uploader.single("image"), async (req, res, next) => {
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
    let imageRecipe = ""
    if(req.file && req.file.path){
      imageRecipe = req.file.path
    }else{
      imageRecipe = image
    }
    const newRecipe = await Recipe.create({
      name,
      instructions,
      image: imageRecipe,
      ingredients,
      preparationtime,
      difficulty,
      category,
      creator: req.session.user._id,
    });
    res.redirect(`/recipes/${newRecipe._id}/details`);
  } catch (err) {
    next(err);
  }
});

// GET "/recipes/:recipeId/details" => Render view with all the recipe details
router.get("/:recipeId/details", async (req, res, next) => {
  const { recipeId } = req.params;
  const isUserActive = res.locals.isUserActive;
  try {
    const selectedRecipe = await Recipe.findById(recipeId).populate("creator");
    const recipeComment = await Comment.find({ recipe: recipeId });
    if (isUserActive === true) {
      let isfavourite = false;
      const user = await User.findById(req.session.user._id);
      if (user.favourites.includes(recipeId)) {
        isfavourite = true;
      }

      let isCreator = false;
      if (req.session.user._id == selectedRecipe.creator._id) {
        isCreator = true;
      }

      res.render("recipes/details.hbs", {
        selectedRecipe,
        isfavourite,
        isUserActive,
        isCreator,
        recipeComment,
      });
    } else {
      res.render("recipes/details.hbs", { selectedRecipe, isUserActive });
    }
  } catch (err) {
    next(err);
  }
});

//POST "/recipes/:recipeId/ingredients" => Adds a new ingredient and redirect
router.post("/:recipeId/ingredients", async (req, res, next) => {
  const { recipeId } = req.params;
  const { ingredients } = req.body;
  try {
    await Recipe.findByIdAndUpdate(recipeId, { $addToSet: { ingredients } });
    res.redirect(`/recipes/${recipeId}/details`);
  } catch (err) {
    next(err);
  }
});

//POST "/recipes/:recipeId/ingredients/edit" => Adds a new ingredient and redirect in edit
router.post("/:recipeId/ingredients/edit", async (req, res, next) => {
  const { recipeId } = req.params;
  const { ingredients } = req.body;
  try {
    await Recipe.findByIdAndUpdate(recipeId, { $addToSet: { ingredients } });
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
    await Recipe.findByIdAndUpdate(recipeId, { $pull: { ingredients } });
    res.redirect(`/recipes/${recipeId}/edit`);
  } catch (err) {
    next(err);
  }
});

// GET "/recipes/:recipeId/edit" => Render edit recipe form view
router.get("/:recipeId/edit", async (req, res, next) => {
  const { recipeId } = req.params;

  try {
    const selectedRecipe = await Recipe.findById(recipeId);
    res.render("recipes/edit", { selectedRecipe });
  } catch (err) {
    next(err);
  }
});

// POST "/:recipeId/edit" => Edit a recipe and redirect
router.post(
  "/:recipeId/edit",
  isLoggedIn,
  uploader.single("image"),
  async (req, res, next) => {
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
      let imageRecipe = "";
      if (req.file && req.file.path) {
        imageRecipe = req.file.path;
      } else {
        imageRecipe = image;
      }
      await Recipe.findByIdAndUpdate(recipeId, {
        name,
        instructions,
        image: imageRecipe,
        ingredients,
        preparationtime,
        difficulty,
        category,
      });

      res.redirect(`/recipes/${recipeId}/details`);
    } catch (err) {
      next(err);
    }
  }
);
// POST "/recipes/:recipeId/delete" => Delete a recipe from the DB and redirect
router.post("/:recipeId/delete", async (req, res, next) => {
  const { recipeId } = req.params;
  try {
    await Recipe.findByIdAndDelete(recipeId);
    res.redirect("/recipes");
  } catch (err) {
    next(err);
  }
});

//GET "recipes/my-recipes" Render a view of the recipes created by the user
router.get("/my-recipes", isLoggedIn, async (req, res, next) => {
  try {
    const myRecipes = await Recipe.find({
      creator: req.session.user._id,
    }).populate("creator");
    let hasRecipes = true;
    if (myRecipes.length === 0) {
      hasRecipes = false;
    }
    res.render("user/my-recipes.hbs", { myRecipes, hasRecipes });
  } catch (err) {
    next(err);
  }
});

//POST "/recipes/:recipeId/isfavourite" => Update boolean isfavourite
router.post("/:recipeId/isfavourite", isLoggedIn, async (req, res, next) => {
  const { recipeId } = req.params;
  try {
    //si la receta esta en la lista de favoritos del usuario
    const user = await User.findById(req.session.user._id);
    if (user.favourites.includes(recipeId)) {
      //await Recipe.findByIdAndUpdate(recipeId, {isfavourite:false})
      await User.findByIdAndUpdate(req.session.user._id, {
        $pull: { favourites: recipeId },
      });
    } else {
      //await Recipe.findByIdAndUpdate(recipeId, {isfavourite:true})
      await User.findByIdAndUpdate(req.session.user._id, {
        $addToSet: { favourites: recipeId },
      });
    }
    res.redirect(`/recipes/${recipeId}/details`);
  } catch (err) {
    next(err);
  }
});

//GET "/recipes/my-favourites" => View my favourites recipes
router.get("/my-favourites", async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user._id).populate(
      "favourites"
    );
    const favouriteList = user.favourites;
    let hasFavourites = false;

    if (favouriteList.length > 0) {
      hasFavourites = true;
    }

   
    res.render("user/favourites.hbs", { favouriteList, hasFavourites });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/:recipeId/my-favourites/isfavourite",
  isLoggedIn,
  async (req, res, next) => {
    const { recipeId } = req.params;
    try {
      //si la receta esta en la lista de favoritos del usuario
      const user = await User.findById(req.session.user._id);
      if (user.favourites.includes(recipeId)) {
        await User.findByIdAndUpdate(req.session.user._id, {
          $pull: { favourites: recipeId },
        });
      }
      res.redirect(`/recipes/my-favourites`);
    } catch (err) {
      next(err);
    }
  }
);

//POST "recipes/:recipeId/comment" => Creates a new comment in the DB
router.post("/:recipeId/comment", isLoggedIn, async (req, res, next) => {
  const { recipeId } = req.params;
  const { content } = req.body;

  try {
    await Comment.create({
      content,
      recipe: recipeId,
      creator: req.session.user._id,
    });

    res.redirect(`/recipes/${recipeId}/details`);
  } catch (err) {
    next(err);
  }
});

router.get("/:recipeId/:commentId/edit", async (req, res, next) => {
  const { commentId } = req.params;

  try {
    const selectedComment = await Comment.findById(commentId);
    let isCreator = false;
    if (req.session.user._id == selectedComment.creator._id) {
      isCreator = true;
    }

    res.render("recipes/comment-edit.hbs", { selectedComment });
  } catch (err) {
    next(err);
  }
});
//POST "recipes/:recipeId/comment/edit" =>  Edit a comment in the DB

router.post(
  "/:recipeId/:commentId/edit",
  isLoggedIn,
  async (req, res, next) => {
    const { recipeId, commentId } = req.params;
    const { content } = req.body;
    try {
      await Comment.findByIdAndUpdate(commentId, { content, isEdited: true });
      res.redirect(`/recipes/${recipeId}/details`);
    } catch (err) {
      next(err);
    }
  }
);

//POST "recipes/:recipeId/comment/delete" => Delete a comment in the DB

router.post(
  "/:recipeId/:commentId/delete",
  isLoggedIn,
  async (req, res, next) => {
    const { recipeId, commentId } = req.params;

    try {
      await Comment.findByIdAndDelete(commentId);
      res.redirect(`/recipes/${recipeId}/details`);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
