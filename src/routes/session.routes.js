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


router.get("/privado", auth, (req, res) => {
  res.render("products", {
    title: "Privado",
    user: req.session.user,
  });
});

router.get("/forgot", (req, res) => {
  res.render("forgot");
});

router.post("/forgot", async (req, res) => {
  const { email, newPassword } = req.body;
  const result = await UserModel.find({
    email: email,
  });

  if (result.length === 0) {
    return res.status(401).json({
      error: "Usuario o contraseña incorrectos",
    });
  } else {
    const respuesta = await UserModel.findByIdAndUpdate(result[0]._id, {
      password: createHash(newPassword),
    });
    res.status(200).json({
      respuesta: "ok",
      datos: respuesta,
    });
  }
});
export default router;