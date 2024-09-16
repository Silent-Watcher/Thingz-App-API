// biome-ignore lint/style/noNamespace: <explanation>
declare namespace Express {
  interface Request {
    user?: { [key: string]: unknown };
  }
}
