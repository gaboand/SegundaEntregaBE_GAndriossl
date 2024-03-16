import { Router } from "express";
import  MessagesDB from "../controllers/chat.controler.js";

const messagesRouter = Router();
const messagesDB = new MessagesDB();


messagesRouter.post("/", async (req, res) => {
  const { user, message } = req.body;
  try {
      const response = await messagesDB.createMessage({ user, message });
      if(response) {
        req.io.emit("newMessage", response);

        return res.status(201).json({ success: true, message: "El mensaje fue creado" });
      } else {
        return res.status(400).json({
          success: false,
          message: "El mensaje no pudo ser creado"
        });
      }
  } catch(error) {
    console.error("Error en POST /api/messages:", error); 
    return res.status(500).json({ success: false, message: error.message });
}

});

export default messagesRouter;