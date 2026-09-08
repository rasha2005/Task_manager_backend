import express from "express";
import { login, getMe } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public
router.post("/login", login);

// Protected
router.get("/me", auth, getMe);

export default router;