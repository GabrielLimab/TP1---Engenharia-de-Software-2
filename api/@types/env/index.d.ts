declare namespace NodeJS {
  interface ProcessEnv {
      APP_URL: string | undefined;
      PORT: string | undefined;
      DATABASE_URL: string | undefined;
      SECRET_KEY: string | undefined;
      JWT_EXPIRATION: string | undefined;
  }
}