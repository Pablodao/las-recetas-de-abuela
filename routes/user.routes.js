const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/auth.js");
const User = require("../models/User.model.js");
const uploader = require("../middlewares/uploader.js");

//GET "/user/myprofile Render my profile view
router.get("/myprofile", isLoggedIn, async (req, res, next) => {
  try {
    const profileUser = await User.findById(req.session.user._id);
    res.render("user/my-profile.hbs", { profileUser });
  } catch (err) {
    next(err);
  }
});

//GET "user/myprofile/edit" Render edit profile view
router.get("/myprofile/edit", isLoggedIn, async (req, res, next) => {
  try {
    const profileUser = await User.findById(req.session.user._id);
    res.render("user/edit.hbs", { profileUser });
  } catch (err) {
    next(err);
  }
});

//POST "user/myprofile/edit" Edit profile and redirect to my profile
router.post(
  "/myprofile/edit",
  isLoggedIn,
  uploader.single("avatar"),
  async (req, res, next) => {
    const { username, email, avatar } = req.body;
    console.log("USERNAME", req.session.user.username);
    console.log("USERNAME BODY", username);
    try {
      // const profileUser = await User.findById(req.session.user._id);
      // const foundUsername = await User.findOne({ username });
      let imageAvatar = "";
      if (req.file && req.file.path) {
        imageAvatar = req.file.path;
      } else {
        imageAvatar = avatar;
      }
      await User.findByIdAndUpdate(req.session.user._id, {
        username,
        email,
        avatar: imageAvatar,
      });

      // if (foundUsername !== null && username !== req.session.user.username) {
      //   res.render("./user/edit.hbs", {
      //     usernameErrorMessage: "El nombre de usuario ya se encuentra en uso",
      //     profileUser,
      //   });
      // } else if (username === req.session.user.username) {
      //  next()
      // } else {
      //   await User.findByIdAndUpdate(req.session.user._id, {
      //     username,
      //   });
      // }
      // //todo SIN TERMINAR
      // const foundEmail = await User.findOne({ email });
      // if (foundEmail !== null && foundEmail !== req.session.user.email) {
      //   res.render("./user/edit.hbs", {
      //     emailErrorMessage: "El email ya se encuentra en uso",
      //     profileUser,
      //   });
      // } else if (foundEmail == req.session.user.email) {
      //   next()
      // } else {
      //   await User.findByIdAndUpdate(req.session.user._id, {
      //     email,
      //   });
      // }
     
      res.redirect("/user/myprofile");
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
