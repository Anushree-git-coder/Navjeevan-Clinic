import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const phone = "9000000001";
    const email = "aayushipal.1993@gmail.com";
    const password = "Doctor@123";

    // Find the existing doctor user
    const existingUser = await User.findOne({
      role: "doctor",
      phone: phone,
    });

    if (existingUser) {
      // Update existing doctor login details
      existingUser.email = email;
      existingUser.fullName = "Dr. Aayushi Pal";
      existingUser.isVerified = true;
      existingUser.password = await bcrypt.hash(password, 10);

      await existingUser.save();

      // Update doctor profile if it exists
      const existingDoctor = await Doctor.findOne({
        user: existingUser._id,
      });

      if (existingDoctor) {
        existingDoctor.email = email;
        existingDoctor.phone = phone;
        existingDoctor.fullName = "Dr. Aayushi Pal";

        await existingDoctor.save();

        console.log("✅ Existing doctor updated successfully.");
      } else {
        console.log("⚠️ Doctor user exists, but doctor profile was not found.");
      }

      console.log("Login phone:", phone);
      console.log("Login email:", email);

      await mongoose.disconnect();
      return;
    }

    // Create new doctor if one doesn't exist
    const user = await User.create({
      fullName: "Dr. Aayushi Pal",
      email,
      phone,
      password: await bcrypt.hash(password, 10),
      role: "doctor",
      isVerified: true,
    });

    await Doctor.create({
      user: user._id,
      fullName: "Dr. Aayushi Pal",
      email,
      phone,
      qualification: "MBBS, MS (OBG & GYNAE), DNB",
      specialization: "Consultant Obstetrician & Gynaecologist",
      experience: 10,
      consultationFee: 800,
      registrationNumber: "NVC-DOC-001",
      bio: "Lead Obstetrician & Gynaecologist at Navjeevan Clinic.",
      availableDays: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      availableSlots: [
        "09:00 AM",
        "09:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
        "12:00 PM",
        "03:00 PM",
        "03:30 PM",
        "04:00 PM",
        "04:30 PM",
        "05:00 PM"
      ],
    });

    console.log("✅ Doctor created successfully.");
    console.log("Login phone:", phone);
    console.log("Login email:", email);

    await mongoose.disconnect();

  } catch (error) {
    console.error("❌ Error creating/updating doctor:");
    console.error(error.message);
    process.exit(1);
  }
};

run();