export {};
declare global {
  namespace Express {
    interface Request {
      value: object;
      user: object;
    }
  }
}
