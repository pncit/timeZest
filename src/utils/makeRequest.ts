import axios from "axios";
import { handleError } from "./handleError";
import { apiEndpoint } from "../constants/endpoints";
import { LogLevel } from "./logger";

/**
 * Makes an API request with retry logic.
 * @template T - The type of the response data.
 * @param log - A logging function to log request details.
 * @param apiKey - The API key for authentication.
 * @param baseUrl - The base URL of the API.
 * @param endpoint - The API endpoint to call.
 * @param method - The HTTP method (GET or POST).
 * @param data - The request payload.
 * @param maxRetryTimeMs - The maximum retry time in milliseconds.
 * @param maxRetryDelayMs - The maximum delay between retries in milliseconds.
 * @returns A promise that resolves to the response data.
 */
export async function makeRequest<T>(
  log: (level: LogLevel, message: string, data?: any) => void,
  apiKey: string,
  baseUrl: string,
  endpoint: apiEndpoint,
  method: "GET" | "POST",
  data: any,
  maxRetryTimeMs: number,
  maxRetryDelayMs: number,
): Promise<T>  {

  let totalElapsedTime = 0;
  let retries = 0;

  while (totalElapsedTime < maxRetryTimeMs) {
    try {
      log(
        "debug",
        `Attempting request to ${endpoint}. Retry count: ${retries}`,
      );
      const response = await axios({
        url: `${baseUrl}${endpoint}`,
        method,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        data,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429) {
        const retryAfterHeader = parseInt(
          error.response.headers["retry-after"],
          10,
        );
        const retryAfter =
          retryAfterHeader || Math.min(maxRetryDelayMs, Math.pow(2, retries));

        if (totalElapsedTime + retryAfter * 1000 >= maxRetryTimeMs) {
          log("error", `Max retry time exceeded for ${endpoint}`);
          break;
        }

        log(
          "warn",
          `Rate limited on ${endpoint}. Retrying after ${retryAfter} seconds...`,
        );
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        totalElapsedTime += retryAfter * 1000;
        retries++;
      } else {
        log(
          "error",
          `Request to ${endpoint} failed with error: ${error.message}`,
        );
        handleError(log, error);
      }
    }
  }

  throw new Error(
    `Max retry time of ${maxRetryTimeMs} minutes exceeded for ${endpoint}`,
  );
};
