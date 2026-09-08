import express from "express";

import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import auth from "../middleware/auth.js";
import role from "../middleware/role.js";

const router = express.Router();

// Admin + Manager
router.get(
  "/",
  auth,
  role("admin", "manager"),
  getUsers
);

// Admin only
router.post(
  "/",
  auth,
  role("admin"),
  createUser
);

// Admin + Manager
router.get(
  "/:id",
  auth,
  role("admin", "manager"),
  getUser
);

// Admin only
router.put(
  "/:id",
  auth,
  role("admin"),
  updateUser
);

// Admin only
router.delete(
  "/:id",
  auth,
  role("admin"),
  deleteUser
);

export default router;