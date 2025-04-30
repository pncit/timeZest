import { LogLevel } from "./logger";

/**
 * Handles errors from API requests.
 * @param log - A logging function to log error details.
 * @param error - The error object to handle.
 * @returns An empty array if the error is a 404, otherwise throws an error.
 */
export type handleError = (
  log: (level: LogLevel, message: string, data?: any) => void,
  error: any,
) => void | [];

export const handleError: handleError = (log, error) => {
  if (error.response) {
    const { status, data } = error.response;
    if (status === 404) {
      log("warn", "Resource not found, returning an empty array.", {
        status,
        data,
      });
      return [];
    }
    log(
      "error",
      `API Error: ${status} - ${data.message || "Unknown error"}`,
      data,
    );
    if (data.errors) {
      log("error", "Details:", data.errors);
    }
    throw new Error(data.message || `HTTP ${status}`);
  } else if (error.request) {
    log("error", "No response received from the API.", {
      message: error.message,
    });
    throw new Error("No response received from the API");
  } else {
    log("error", "Error setting up the request.", { message: error.message });
    throw new Error("Error setting up the request");
  }
};
