import { sign } from "jsonwebtoken";
import configs from "../configs";

// Set types for payload temporarily

// Sign jwt
export default (id: string): string => {
  return sign({ id }, configs.jwt.secret, {
    expiresIn: configs.jwt.expires_in,
  });
};
