const router = require("express").Router();
const {isLoggedIn} = require("../middlewares/auth.js")

router.get("/myprofile" , isLoggedIn, (req, res, next) => {
    res.render("user/my-profile.hbs")
})


module.exports = router;