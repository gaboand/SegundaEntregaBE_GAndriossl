import { Router } from "express";
import UserModel from "../dao/models/user.model.js";;
import { auth } from "../middlewares/index.js";
import { createHash, isValidPassword, generateToken, passportCall, authorization } from "../utils.js";
import passport from "passport";

const router = Router();

router.post("/signup", (req, res, next) => {
  passport.authenticate("register", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(400).json({ error: info.message });
    }
    return res.status(200).json({ message: "Usuario creado con éxito" });
  })(req, res, next);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (user === null) {
    res.status(400).json({
      error: "Usuario o contraseña incorrectos",
    });
  } else if (!isValidPassword(user.password, password)) {
    res.status(401).json({
      error: "Usuario o contraseña incorrectos",
    });
  } else {

    req.login(user, function(err) {
      if (err) { return next(err); }

      req.session.user = email;
      req.session.name = user.first_name;
      req.session.last_name = user.last_name;
      req.session.role = "user";
      res.status(200).json({
        respuesta: "ok",
        cartId: user.cartId 
      });
    });
  } 
});


router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user.username || req.user.email;
    req.session.name = req.user.first_name || req.user.email;
    req.session.last_name = req.user.last_name || '';
    req.session.admin = true;
    const cartId = req.user.cartId;
    res.redirect(`/products?cartId=${cartId}`);
  }
);



 router.post("/loginJWT", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Faltan datos" });
  }
  if (username === "coder@coder.com" && password === "1234") {
    const myToken = generateToken({ username });
    res
      .cookie("coderCookieToken", myToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .status(200)
      .json({ status: "success", token: myToken });
  } else {
    res.status(401).json({ error: "Usuario o contraseña incorrectos" });
  }
});

router.get("/current", passportCall("jwt"), authorization("admin"), (req, res) => {
  res.status(200).json(req.user);
});

router.get('/logout', (req, res) => {
  req.logout(function(err) {
      if (err) { return next(err); }
      req.session.destroy(function(err) {
          if (err) {
              console.log("Error al destruir la sesión:", err);
          }
          res.redirect('/login');
      });
  });
});

router.get("/privado", (req, res) => { 
  if (req.session.user) { 
      res.render("products", {
          title: "Productos",
          user: req.session.user,
          name: req.session.name,
          lastName: req.session.last_name,
          welcomeMessage: `Bienvenido/a, ${req.session.user} ${req.session.last_name}!`
      });
  } else {
      res.redirect("/login");
  }
});

router.get("/privado", auth, (req, res) => {
  res.render("products", {
    title: "Privado",
    user: req.session.user,
  });
});


router.get('/forgot', (req, res) => {
  res.render('forgot');
});

router.post('/forgot', async (req, res) => {
  const { email, newPassword } = req.body;
  try {
      const user = await UserModel.findOne({ email: email });
      if (!user) {
          return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      const hashedPassword = createHash(newPassword); 
      await UserModel.updateOne({ email: email }, { $set: { password: hashedPassword } });
      res.json({ success: true, message: "ok" });
       
  } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      res.status(500).send('Error al procesar tu solicitud');
  }
});

export default router;