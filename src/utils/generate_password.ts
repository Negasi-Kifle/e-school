import { generate } from "generate-password";

// Generate random password
export default (): string => {
  return generate({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
};
