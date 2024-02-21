import express from "express";
import { Server } from "socket.io"; 
import handlebars from "express-handlebars";
import IndexRouter from "./routes/index.routes.js";
import mongoose from "mongoose";
import { __dirname, generateToken, passportCall, authorization} from "./utils.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import initializePassportGH from "./config/passportGithub.config.js";
import sessionRouter from "./routes/session.routes.js";
import initializePassportJWT from "./config/passportJWT.config.js";


const app = express();
const PORT = process.env.PORT || 8080;
const DB_URL = process.env.DB_URL;
const COOKIESECRET = process.env.CODERSECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("COOKIESECRET"));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine()); 
app.set("views", __dirname + "/views"); 
app.set("view engine", "handlebars");

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: DB_URL,
      mongoOptions: {
        useNewUrlParser: true,
      },
      ttl: 3600,
    }),
    secret: "CoderSecret",
    resave: false,
    saveUninitialized: true,
  })
);

initializePassport();
initializePassportGH();
initializePassportJWT();

app.use(passport.initialize());
app.use(passport.session());


app.use("/", sessionRouter);
app.use("/api/session", sessionRouter);

app.post("/loginJWT", (req, res) => {
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


app.get("/current", passportCall("jwt"), authorization("admin"), (req, res) => {
  res.status(200).json(req.user);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(server);

app.use((req, res, next) => {
	req.io = io;
	next();
});

app.use("/", IndexRouter);

io.on("connection", (socket) => {
	console.log("Se conecto un nuevo usuario");
});

startMongoConnection()
  .then(() => {
    console.log("Base de datos conectada");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  })

  async function startMongoConnection() {
    await mongoose.connect(DB_URL);
  }

export default app;