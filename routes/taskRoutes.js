import express from "express";

import {
  getTasks,
  getMyTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../controllers/taskController.js";

import auth from "../middleware/auth.js";
import role from "../middleware/role.js";

const router = express.Router();

// Employee
router.get(
    "/my-tasks",
    auth,
    role("employee"),
    getMyTasks
  );
  
// Admin + Manager
router.get(
  "/",
  auth,
  role("admin", "manager"),
  getTasks
);


// Admin + Manager
router.get(
  "/:id",
  auth,
  role("admin", "manager"),
  getTask
);

// Admin + Manager
router.post(
  "/",
  auth,
  role("admin", "manager"),
  createTask
);

// Admin + Manager
router.put(
  "/:id",
  auth,
  role("admin", "manager"),
  updateTask
);

// Admin only
router.delete(
  "/:id",
  auth,
  role("admin"),
  deleteTask
);

// Employee
router.patch(
  "/:id/status",
  auth,
  role("employee"),
  updateTaskStatus
);

export default router;