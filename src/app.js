import express from "express";
import { Server } from "socket.io"; 
import handlebars from "express-handlebars";
import IndexRouter from "./routes/index.routes.js";
import mongoose from "mongoose";
import { __dirname} from "./utils.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import initializePassportGH from "./config/passportGithub.config.js";
import sessionRouter from "./routes/session.routes.js";
import initializePassportJWT from "./config/passportJWT.config.js";
import cors from "cors";

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

const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(server);

app.use((req, res, next) => {
	req.io = io;
	next();
});

app.use("/", IndexRouter);

app.use(cors({ 
  origin: ["http://localhost:3000", "http://127.0.0.1:5500"]
}));

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