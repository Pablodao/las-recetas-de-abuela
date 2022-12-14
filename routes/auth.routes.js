const router = require("express").Router();
const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");

//* SIGNUP

// GET "/auth/signup" => Render signup view
router.get("/signup", (req, res, next) => {
  res.render("./auth/signup.hbs");
});

// POST "/auth/signup" => Creates the user in the DB and redirect
router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;

  //* GC
  // Empty input
  if (
    (username === "") & (email === "") & (password === "") ||
    (username === "") & (email === "") ||
    (username === "") & (password === "") ||
    (email === "") & (password === "")
  ) {
    res.render("auth/signup.hbs", {
      errorMessage: "Por favor rellene todos los campos",
    });
    return;
  }

  if (username === "") {
    res.render("auth/signup.hbs", {
      usernameErrorMessage: "Por favor rellene el campo del nombre de usuario",
    });
    return;
  }
  if (email === "") {
    res.render("auth/signup.hbs", {
      emailErrorMessage: "Por favor rellene el campo del email",
    });
    return;
  }

  if (password === "") {
    res.render("auth/signup.hbs", {
      passwordErrorMessage: "Por favor rellene el campo de la contraseña",
    });
    return;
  }

  // Strong password
  const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/;
  if (passwordRegex.test(password) === false) {
    res.render("auth/signup.hbs", {
      passwordErrorMessage:
        "La contraseña debe contener mínimo una mayúscula, una minúscula, un número, un carácter especial y entre 8 y 64 caracteres",
    });
    return;
  }

  // Email validation
  const emailRegex =
    /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/;
  if (emailRegex.test(email) === false) {
    res.render("auth/signup.hbs", {
      emailErrorMessage: "Por favor, introduzca una dirección de correo válida",
    });
    return;
  }

  try {
    // GC Email already exist
    const foundUser = await User.findOne({ email });
    if (foundUser !== null) {
      res.render("./auth/signup.hbs", {
        emailErrorMessage: "Correo electrónico en uso",
      });
    }
    // GC Username already in use
    const foundUserByUsername = await User.findOne({ username });
    if (foundUserByUsername !== null) {
      res.render("./auth/signup.hbs", {
        usernameErrorMessage: "El nombre de usuario ya se encuentra en uso",
      });
    }
    

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

//* LOG IN

// GET "/auth/login" => Renders view with login/access form
router.get("/login", (req, res, next) => {
  res.render("./auth/login.hbs");
});

// POST "/auth/login" => Allows access to the user - User Validation
router.post("/login", async (req, res, next) => {
  const { access, password } = req.body;
  //Empty input

  if (access === "") {
    res.render("./auth/login.hbs", {
      errorMessage: "Por favor, introduzca su nombre de usuario o email",
    });
    return;
  }

  if (password === "") {
    res.render("./auth/login.hbs", {
      passwordErrorMessage: "Contraseña requerida",
    });
    return;
  }
  try {
    //Find user
    const foundUser = await User.findOne({
      $or: [{ username: access }, { email: access }],
    });
    if (foundUser === null) {
      res.render("./auth/login.hbs", { errorMessage: "Usuario no encontrado" });
      return;
    }

    //valid password
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    
    if (isPasswordValid === false) {
      res.render("./auth/login.hbs", {
        passwordErrorMessage: "Constraseña inválida",
      });
      return;
    }

    req.session.user = {
      _id: foundUser._id,
      email: foundUser.email,
      username: foundUser.username,
    };
    req.session.save(() => {
      res.redirect("/");
    });
  } catch (err) {
    next(err);
  }
});

//* LOG OUT
//GET "/auth/logout" => user can log out
router.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
