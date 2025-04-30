import { LogLevel } from "./logger.d";

/**
 * Handles errors from API requests.
 * @param log - A logging function to log error details.
 * @param error - The error object to handle.
 * @returns An empty array if the error is a 404, otherwise throws an error.
 */
export function handleError(
  log: (level: LogLevel, message: string, data?: any) => void,
  error: any,
): void | [];
