import bcrypt from "bcryptjs";

import User from "../models/user.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      organizationId: req.user.organizationId,
    }).select("-password");

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and role are required",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      organizationId: req.user.organizationId,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, password, role, isActive } = req.body;

    const user = await User.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (email !== undefined) {
      user.email = email;
    }

    if (role !== undefined) {
      user.role = role;
    }

    if (isActive !== undefined) {
      user.isActive = isActive;
    }

    if (password !== undefined && password !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};