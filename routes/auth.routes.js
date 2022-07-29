const router = require("express").Router();
const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");

//* SIGNUP

// GET "/auth/signup" => Render signup view

router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

// POST "/auth/signup" => Creates the user in the DB and redirect
router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;

  //* GC
  // Empty input
  if (username === "" || email === "" || password === "") {
    res.render("auth/signup.hbs", {
      errorMessage: "Por favor rellene todos los campos",
    });
    return;
  }
  // Strong password
  const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/;
  if (passwordRegex.test(password) === false) {
    res.render("auth/signup.hbs", {
      errorMessage:
        "La contraseña debe contener mínimo una mayúscula, una minúscula, un número, un carácter especial y entre 8 y 64 caracteres",
    });
    return;
  }

  // Email validation
  const emailRegex =
    /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/;
  if (emailRegex.test(email) === false) {
    res.render("auth/signup.hbs", {
      errorMessage: "Por favor, introduzca una dirección de correo válida",
    });
    return;
  }

  try {
    // GC User already exist
    const foundUser = await User.findOne({ emai });
    if (foundUser !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "Correo electrónico en uso",
      });
    }
    // GC Username already in use
    const foundUserByUsername = await User.findOne({ username });
    if (foundUserByUsername !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "El nombre de usuario ya se encuentra en uso",
      });
    }
    console.log("TODAS LAS VALIDACIONES HAN SIDO SUPERADAS!");

    // PASSWORD ENCRYPTION
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.redirect("/auth/login");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
