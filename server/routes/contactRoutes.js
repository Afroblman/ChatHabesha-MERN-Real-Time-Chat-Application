import express from "express";
import {
  getContacts,
  addContact,
  deleteContact,
  blockContact,
  unblockContact,
} from "../controllers/contactController.js";
import { auth } from "../middlewares/auth.js";

const contactRouter = express.Router();

contactRouter.get("/contacts", auth, getContacts);
contactRouter.post("/add-contact/:id", auth, addContact);
contactRouter.post("/delete-contact/:id", auth, deleteContact);
contactRouter.post("/block-contact/:id", auth, blockContact);
contactRouter.post("/unblock-contact/:id", auth, unblockContact);

export default contactRouter;
