const router = require("express").Router();

router.use((req, res, next) =>{
  if(req.session.user === underfined){
    res.locals.isUserActive = false; 
  }else {
    res.locals.isUserActive = true;
  }
  next()
})

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// * ROUTES

// Auth
const authRoutes = require("./auth.routes.js");
router.use("/auth", authRoutes);

// Users
const userRoutes = require("./user.routes.js");
router.use("/user", userRoutes);

// Recipes
const recipesRoutes = require("./recipes.routes.js");
router.use("/recipes", recipesRoutes);

module.exports = router;
