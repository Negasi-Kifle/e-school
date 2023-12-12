import { JwtPayload, verify } from "jsonwebtoken";
import configs from "../configs";

// Expected payload
interface CustomPayload extends JwtPayload {
  id: string;
}

/**
 * Verifies jwt token
 */
export default (token: string): CustomPayload => {
  return verify(token, configs.jwt.secret) as CustomPayload;
};
