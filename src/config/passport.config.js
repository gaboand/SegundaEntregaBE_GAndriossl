import passport from "passport";
import local from "passport-local";
import { UserModel } from "../dao/mongo/models/user.model.js";
import { CartModel } from "../dao/mongo/models/carts.model.js"; 
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await UserModel.findOne({ email: username });
          if (user) {
            return done(null, false, { message: "El usuario ya existe" });
          }

          const newCart = await CartModel.create({});

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password), 
            cartId: newCart._id, 
          };

          const result = await UserModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error al crear el usuario", error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById(id);
    done(null, user);
  });

  passport.use(
    "login",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "password", 
      },
      async (req, username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username });
          if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
          }

          if (!isValidPassword(user.password, password)) {
            return done(null, false, { message: "Contraseña incorrecta" });
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done("Error al obtener el usuario", error);
        }
      }
    )
  );
};

export default initializePassport;
