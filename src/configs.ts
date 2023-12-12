import { config } from "dotenv";
import path from "path";

config({ path: path.join(process.cwd(), "./src/config.env"), debug: true });

// Put all enironment variables into one object
export default {
  env: <string>process.env.NODE_ENV,
  mongoDB: <string>process.env.MONGO_DB,
  jwt: {
    secret: <string>process.env.JWT_SECRET,
    expires_in: <string>process.env.JWT_EXPIRES_IN,
  },
  delete_key: process.env.DELETE_KEY,
  api_key: process.env.API_KEY,
};
