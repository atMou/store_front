declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_BASE_API_URL: string;
    NEXT_PUBLIC_LOG_LEVEL: "debug" | "info" | "warn" | "error";
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    IsDev: boolean;
  }
}
