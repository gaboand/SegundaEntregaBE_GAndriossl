import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const DB_URL = process.env.DB_URL;
export default class MongoSingleton {
  static #instance;

  constructor() {
    mongoose.connect(DB_URL);
  }
  static getInstance() {
    if (this.#instance) {
      console.log("Ya existe una conexión");
      return this.#instance;
    }
    console.log("No existe una conexion");
    this.#instance = new MongoSingleton();
    return this.#instance;
  }
}