import { defaultLogger } from "../utils/logger";
import { TimeZestAPIConfig } from "./config.d";

export const CONFIG: TimeZestAPIConfig = {
  logLevel: "error",
  logger: defaultLogger,
  baseUrl: "https://api.timezest.com/v1",
  maxRetryDelayMs: 1.5 * 60 * 1000, // 1.5 minutes
  maxRetryTimeMs: 15 * 1000, // 15 seconds
};
