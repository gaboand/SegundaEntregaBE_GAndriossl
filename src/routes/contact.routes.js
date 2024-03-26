import express from "express";
import { contactService } from "../repository/index.js";

const contactRouter = express.Router();

contactRouter.get("/", async (req, res) => {
  const data = await contactService.getContacts();
  res.json(data);
});

contactRouter.post("/", async (req, res) => {
  const contact = req.body;
  const data = await contactService.createContact(contact);
  res.json(data);
});

contactRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const contact = req.body;
  const data = await contactService.modifyContact(id, contact);
  res.json(data);
});

contactRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const data = await contactService.deleteContact(id);
  res.json(data);
});

export default contactRouter;