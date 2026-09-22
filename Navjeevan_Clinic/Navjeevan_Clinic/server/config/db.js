import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected : ${conn.connection.host}`);
    console.log(`MongoDB Database : ${conn.connection.name}`);

    const collections = await conn.connection.db
      .listCollections()
      .toArray();

    console.log(
      "MongoDB Collections :",
      collections.map((collection) => collection.name)
    );

    const userCount = await conn.connection.db
      .collection("users")
      .countDocuments();

    console.log(`Users Collection Count : ${userCount}`);
  } catch (error) {
    console.log("Database Connection Failed");
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;