import express from "express";
import { Server } from "socket.io"; 
import handlebars from "express-handlebars";
import IndexRouter from "./routes/index.routes.js";
import mongoose from "mongoose";
import { __dirname } from "./utils.js";

const app = express();
const PORT = process.env.PORT || 8080;
const DB_URL = process.env.DB_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine()); 
app.set("views", __dirname + "/views"); 
app.set("view engine", "handlebars");

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