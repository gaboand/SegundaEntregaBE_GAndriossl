import { Router } from "express";
import UserModel from "../dao/models/user.model.js";;
import { auth } from "../middlewares/index.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await UserModel.findOne({ email });

  if (result === null) {
    res.status(400).json({
      error: "Usuario o contraseña incorrectos",
    });
  } else if (!isValidPassword(result.password, password)) {
    res.status(401).json({
      error: "Usuario o contraseña incorrectos",
    });
  } else {
    req.session.user = email;
    req.session.name = result.first_name;
    req.session.last_name = result.last_name;
    req.session.role = "user";
    res.status(200).json({
      respuesta: "ok",
    });
  } 
});


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


router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);


router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user.email;
    req.session.user = req.user.username || req.user.email;
    req.session.name = req.user.first_name || req.user.email;; 
    req.session.last_name = req.user.last_name || '';
    req.session.admin = true;
    res.redirect("/products");
  }
);

export default router;