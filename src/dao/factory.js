import config from "../config/config.js";
import mongoose from "mongoose";

export let Contacts;

switch (config.persistence) {
  case "MONGO":
    const connnection = await mongoose.connect(config.DB_URL);
    const { default: ContactMongo } = await import("./mongo/contact.js");
    Contacts = ContactMongo;
    break;
  case "MEMORY":
    const { default: ContactMemory } = await import("./memory/contactManager.js");
    Contacts = ContactMemory;
    break;
}

export default Contacts;