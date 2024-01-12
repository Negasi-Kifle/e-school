import { config } from "dotenv";
import path from "path";
import SMTPConnection from "nodemailer/lib/smtp-connection";

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
  ui_url:process.env.URL as string,
  delete_key: process.env.DELETE_KEY,
  api_key: process.env.API_KEY,
  cloudinary: {
    cloud_name: <string>process.env.CLOUDINARY_CLOUD_NAME,
    api_key: <string>process.env.CLOUDINARY_API_KEY,
    api_secret: <string>process.env.CLOUDINARY_API_SECRET,
  },
  chapa,
  smtp:{
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
  },
  smtp_auth: {
    email: process.env.SMTP_EMAIL,
    pswd: process.env.SMTP_PASSWORD,
  },
};
