import mongoose, { Connection } from "mongoose";
import configs from "../configs";

// Connect to MongoDB and export the connection
export default (): Connection => {
  mongoose
    .connect(configs.mongoDB)
    .then(() => {
      console.log("MongoDB Connected successfully");
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });

  const db = mongoose.connection;

  // Listen to events
  db.on("error", (err: Error) => {
    console.log(err);
  });

  db.on("disconnect", () => {
    console.log("Mongo DB Disconnected");
  });
  return db;
};
