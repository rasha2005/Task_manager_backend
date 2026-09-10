import User from "../models/user.js";
import Task from "../models/task.js";

export const getDashboard = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    const totalUsers = await User.countDocuments({
      organizationId,
    });

    const totalTasks = await Task.countDocuments({
      organizationId,
    });

    const todoTasks = await Task.countDocuments({
      organizationId,
      status: "todo",
    });

    const inProgressTasks = await Task.countDocuments({
      organizationId,
      status: "in_progress",
    });

    const completedTasks = await Task.countDocuments({
      organizationId,
      status: "completed",
    });

    let myTasks = null;

    if (req.user.role === "employee") {
      const myTotalTasks = await Task.countDocuments({
        organizationId,
        assignedTo: req.user.userId,
      });

      const myCompletedTasks = await Task.countDocuments({
        organizationId,
        assignedTo: req.user.userId,
        status: "completed",
      });

      const myInProgressTasks = await Task.countDocuments({
        organizationId,
        assignedTo: req.user.userId,
        status: "in_progress",
      });

      const myTodoTasks = await Task.countDocuments({
        organizationId,
        assignedTo: req.user.userId,
        status: "todo",
      });

      myTasks = {
        total: myTotalTasks,
        todo: myTodoTasks,
        inProgress: myInProgressTasks,
        completed: myCompletedTasks,
      };
    }

    return res.status(200).json({
      user: {
        id: req.user.userId,
        role: req.user.role,
        organizationId,
      },
      organization: {
        totalUsers,
        totalTasks,
      },
      tasks: {
        todo: todoTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
      },
      myTasks,
    });
  } catch (error) {
    console.error("Get dashboard error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};