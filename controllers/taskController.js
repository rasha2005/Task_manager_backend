import Task from "../models/task.js";
import User from "../models/user.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      organizationId: req.user.organizationId,
    })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      organizationId: req.user.organizationId,
      assignedTo: req.user.userId,
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.error("Get my tasks error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email role");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      task,
    });
  } catch (error) {
    console.error("Get task error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      assignedTo,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    // If a user is being assigned, make sure they belong
    // to the same organization.
    if (assignedTo) {
      const assignedUser = await User.findOne({
        _id: assignedTo,
        organizationId: req.user.organizationId,
      });

      if (!assignedUser) {
        return res.status(400).json({
          message: "Assigned user not found in your organization",
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      priority,
      organizationId: req.user.organizationId,
      createdBy: req.user.userId,
      assignedTo: assignedTo || null,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email role");

    return res.status(201).json({
      message: "Task created successfully",
      task: populatedTask,
    });
  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      assignedTo,
    } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (title !== undefined) {
      task.title = title;
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (status !== undefined) {
      task.status = status;
    }

    if (priority !== undefined) {
      task.priority = priority;
    }

    if (assignedTo !== undefined) {
      if (assignedTo === null) {
        task.assignedTo = null;
      } else {
        const assignedUser = await User.findOne({
          _id: assignedTo,
          organizationId: req.user.organizationId,
        });

        if (!assignedUser) {
          return res.status(400).json({
            message: "Assigned user not found in your organization",
          });
        }

        task.assignedTo = assignedTo;
      }
    }

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email role");

    return res.status(200).json({
      message: "Task updated successfully",
      task: populatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const allowedStatuses = [
      "todo",
      "in_progress",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
      assignedTo: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Assigned task not found",
      });
    }

    task.status = status;

    await task.save();

    return res.status(200).json({
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task status error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};