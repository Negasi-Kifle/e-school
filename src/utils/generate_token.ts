import { sign } from "jsonwebtoken";
import configs from "../configs";

type TokenPayload = { id: string; full_name: string; role: string };

export default (payload: TokenPayload): string => {
  return sign(
    { id: payload.id, full_name: payload.full_name, role: payload.role },
    configs.jwt.secret,
    {
      expiresIn: configs.jwt.expires_in,
    }
  );
};
