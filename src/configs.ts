import { config } from "dotenv";
import path from "path";

config({ path: path.join(process.cwd(), "./src/config.env"), debug: true });

// Chapa APIs keys for different env
let chapa: { public_key: string; secret_key: string };

if (
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "local"
) {
  chapa = {
    public_key: <string>process.env.CHAPA_PUBLIC_KEY_TEST,
    secret_key: <string>process.env.CHAPA_SECRET_KEY_TEST,
  };
} else {
  chapa = {
    public_key: <string>process.env.CHAPA_PUBLIC_KEY_PROD,
    secret_key: <string>process.env.CHAPA_SECRET_KEY_PROD,
  };
}

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
  cloudinary: {
    cloud_name: <string>process.env.CLOUDINARY_CLOUD_NAME,
    api_key: <string>process.env.CLOUDINARY_API_KEY,
    api_secret: <string>process.env.CLOUDINARY_API_SECRET,
  },
  chapa,
};
