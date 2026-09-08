import "dotenv/config";

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import Organization from "./models/organization.js";
import User from "./models/user.js"
import Task from "./models/task.js";

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB connected");

    // Clear existing data
    await Task.deleteMany({});
    await User.deleteMany({});
    await Organization.deleteMany({});

    console.log("Old data cleared");

    // --------------------------------------------------
    // ORGANIZATIONS
    // --------------------------------------------------

    const acme = await Organization.create({
      name: "Amanager@acme.comcme Corporation",
    });

    const globex = await Organization.create({
      name: "Globex Corporation",
    });

    console.log("Organizations created");

    // --------------------------------------------------
    // PASSWORD
    // --------------------------------------------------

    const hashedPassword = await bcrypt.hash(
      "Password123",
      10
    );

    // --------------------------------------------------
    // ACME USERS
    // --------------------------------------------------

    const acmeAdmin = await User.create({
      name: "Alice Admin",
      email: "admin@acme.com",
      password: hashedPassword,
      role: "admin",
      organizationId: acme._id,
    });

    const acmeManager = await User.create({
      name: "Mark Manager",
      email: "manager@acme.com",
      password: hashedPassword,
      role: "manager",
      organizationId: acme._id,
    });

    const acmeEmployee1 = await User.create({
      name: "John Employee",
      email: "employee@acme.com",
      password: hashedPassword,
      role: "employee",
      organizationId: acme._id,
    });

    const acmeEmployee2 = await User.create({
      name: "Sarah Employee",
      email: "sarah@acme.com",
      password: hashedPassword,
      role: "employee",
      organizationId: acme._id,
    });

    // --------------------------------------------------
    // GLOBEX USERS
    // --------------------------------------------------

    const globexAdmin = await User.create({
      name: "Bob Admin",
      email: "admin@globex.com",
      password: hashedPassword,
      role: "admin",
      organizationId: globex._id,
    });

    const globexManager = await User.create({
      name: "Tom Manager",
      email: "manager@globex.com",
      password: hashedPassword,
      role: "manager",
      organizationId: globex._id,
    });

    const globexEmployee = await User.create({
      name: "Lisa Employee",
      email: "employee@globex.com",
      password: hashedPassword,
      role: "employee",
      organizationId: globex._id,
    });

    console.log("Users created");

    // --------------------------------------------------
    // ACME TASKS
    // --------------------------------------------------

    await Task.create([
      {
        title: "Build login page",
        description: "Create the authentication UI",
        status: "completed",
        priority: "high",
        organizationId: acme._id,
        createdBy: acmeManager._id,
        assignedTo: acmeEmployee1._id,
      },
      {
        title: "Create dashboard",
        description: "Build the organization dashboard",
        status: "in_progress",
        priority: "medium",
        organizationId: acme._id,
        createdBy: acmeManager._id,
        assignedTo: acmeEmployee1._id,
      },
      {
        title: "Prepare documentation",
        description: "Write project documentation",
        status: "todo",
        priority: "low",
        organizationId: acme._id,
        createdBy: acmeAdmin._id,
        assignedTo: acmeEmployee2._id,
      },
    ]);

    // --------------------------------------------------
    // GLOBEX TASKS
    // --------------------------------------------------

    await Task.create([
      {
        title: "Design landing page",
        description: "Create the company landing page",
        status: "in_progress",
        priority: "high",
        organizationId: globex._id,
        createdBy: globexManager._id,
        assignedTo: globexEmployee._id,
      },
      {
        title: "Fix navigation",
        description: "Resolve navigation issues",
        status: "todo",
        priority: "medium",
        organizationId: globex._id,
        createdBy: globexAdmin._id,
        assignedTo: globexEmployee._id,
      },
    ]);

    console.log("Tasks created");

    console.log("\n=================================");
    console.log("DATABASE SEEDED SUCCESSFULLY");
    console.log("=================================\n");

    console.log("ACME CORPORATION");
    console.log("------------------------------");
    console.log("Admin:");
    console.log("  admin@acme.com");
    console.log("  Password123\n");

    console.log("Manager:");
    console.log("  manager@acme.com");
    console.log("  Password123\n");

    console.log("Employee:");
    console.log("  employee@acme.com");
    console.log("  Password123\n");

    console.log("GLOBEX CORPORATION");
    console.log("------------------------------");
    console.log("Admin:");
    console.log("  admin@globex.com");
    console.log("  Password123\n");

    console.log("Manager:");
    console.log("  manager@globex.com");
    console.log("  Password123\n");

    console.log("Employee:");
    console.log("  employee@globex.com");
    console.log("  Password123\n");

    console.log("=================================\n");

    await mongoose.connection.close();

    console.log("MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedDatabase();