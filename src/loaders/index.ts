import http from "http";
import app from "./server";
import mongo from "./mongo";

// Create the server
export default () => {
  const server = http.createServer(app);
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

  // MongoDB Connection
  const mongoDB = mongo();

  process.on("SIGINT", () => {
    console.log("Sever closed");
    server.close();
    console.log("MongoDB Closed");
    mongoDB.close();
  });

  return mongoDB;
};
