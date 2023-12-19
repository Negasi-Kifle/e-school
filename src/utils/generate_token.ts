import { sign } from "jsonwebtoken";
import configs from "../configs";

type TokenPayload = { id: string; role: string };

export default (payload: TokenPayload): string => {
  return sign({ id: payload.id, role: payload.role }, configs.jwt.secret, {
    expiresIn: configs.jwt.expires_in,
  });
};
