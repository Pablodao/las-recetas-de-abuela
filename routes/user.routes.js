const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/auth.js");
const User = require("../models/User.model.js");

router.get("/myprofile", isLoggedIn, async (req, res, next) => {
  try {
    const profileUser = await User.findById(req.session.user._id);
    res.render("user/my-profile.hbs", {profileUser});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
