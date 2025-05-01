import { defaultLogger, LogLevel, Logger } from "../utils/logger";

/**
 * Configuration options for the TimeZest API client.
 */
export interface TimeZestAPIConfig {
  /**
   * The log level for the API client (e.g., 'info', 'debug', 'error').
   */
  logLevel: LogLevel;

  /**
   * The logger instance to use for logging messages.
   */
  logger: Logger;

  /**
   * The base URL for the TimeZest API.
   */
  baseUrl: string;

  /**
   * The maximum delay between retries, in milliseconds.
   */
  maxRetryDelayMs: number;

  /**
   * The maximum total retry time, in milliseconds.
   */
  maxRetryTimeMs: number;

  /**
   * Whether to validate API responses using Zod schemas.
   */
  outputValidation: boolean;
}

/**
 * Default configuration for the TimeZest API client.
 */
export const CONFIG: TimeZestAPIConfig = {
  logLevel: "error",
  logger: defaultLogger,
  baseUrl: "https://api.timezest.com/v1",
  maxRetryDelayMs: 1.5 * 60 * 1000, // 1.5 minutes
  maxRetryTimeMs: 15 * 1000, // 15 seconds
  outputValidation: true,
};
