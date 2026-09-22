import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminEmail = "navjeevan.gynac.clinic@gmail.com";
    const adminPhone = "9000000000";
    const adminPassword = "Admin@123";

    const existingAdmin = await User.findOne({
      role: "admin",
    });

    if (existingAdmin) {
      existingAdmin.email = adminEmail;
      existingAdmin.phone = adminPhone;
      existingAdmin.fullName = "System Administrator";
      existingAdmin.isVerified = true;

      // Update password
      existingAdmin.password = await bcrypt.hash(adminPassword, 10);

      await existingAdmin.save();

      console.log("✅ Existing admin updated successfully.");
      console.log("Email:", existingAdmin.email);
      console.log("Phone:", existingAdmin.phone);

      process.exit();
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await User.create({
      fullName: "System Administrator",
      email: adminEmail,
      phone: adminPhone,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    console.log("✅ Admin created successfully.");
    console.log("Email:", admin.email);
    console.log("Phone:", admin.phone);

    process.exit();

  } catch (error) {
    console.error("❌ Error creating/updating admin:");
    console.error(error.message);

    process.exit(1);
  }
};

createAdmin();