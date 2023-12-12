import { generate } from "otp-generator";
import bcrypt from "bcryptjs";

/**
 * Generates OTP
 */
export default () => {
  // Generate plain otp
  const otp = generate(6, {
    digits: true,
    upperCaseAlphabets: true,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  // Hash the OTP
  const hashedOTP = bcrypt.hashSync(otp, 12);
  return { otp, hashedOTP };
};
