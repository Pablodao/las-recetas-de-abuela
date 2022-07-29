const router = require("express").Router();
const {isLoggedIn} = require("../middlewares/auth.js")

router.get("/profile" , isLoggedIn, (req, res, next) => {
    res.render("index.hbs")
})


module.exports = router;