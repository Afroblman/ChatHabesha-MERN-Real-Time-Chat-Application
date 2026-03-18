import mongoose, { mongo } from "mongoose";

const db = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("DB connected successfully.");
    });
    await mongoose.connect(`${process.env.MONGODB_URL}`);
  } catch (error) {
    console.error("DB connection failed." + error.message);
    process.exit(1);
  }
};

export default db;
