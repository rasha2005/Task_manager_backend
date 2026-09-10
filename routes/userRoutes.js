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

router.get(
  "/",
  auth,
  role("admin", "manager"),
  getUsers
);

router.post(
  "/",
  auth,
  role("admin"),
  createUser
);

router.get(
  "/:id",
  auth,
  role("admin", "manager"),
  getUser
);

router.put(
  "/:id",
  auth,
  role("admin"),
  updateUser
);

router.delete(
  "/:id",
  auth,
  role("admin"),
  deleteUser
);

export default router;