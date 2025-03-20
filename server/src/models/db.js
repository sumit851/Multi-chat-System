import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose
      .connect(process.env.DB_URI, {})
      .then(() => {
        console.log("Database Connected");
      })
      .catch(() => {
        console.log("Unable to connect database");
      });
  } catch (error) {
    console.log("Something is Broken");
  }
};
