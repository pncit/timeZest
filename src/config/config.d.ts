import { LogLevel, Logger } from "../utils/logger";

export interface TimeZestAPIConfig {
  logLevel: LogLevel;
  logger: Logger;
  baseUrl: string;
  maxRetryDelayMs: number;
  maxRetryTimeMs: number;
}
