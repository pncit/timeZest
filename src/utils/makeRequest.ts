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
): Promise<T> {
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
        // Parse Retry-After header (can be in seconds or HTTP date format)
        let retryAfterMs: number;
        const retryAfterHeader = error.response.headers["retry-after"];
        
        if (retryAfterHeader) {
          const retryAfterSeconds = parseInt(retryAfterHeader, 10);
          if (!isNaN(retryAfterSeconds)) {
            retryAfterMs = retryAfterSeconds * 1000;
          } else {
            // HTTP date format - calculate difference
            const retryDate = new Date(retryAfterHeader);
            if (isNaN(retryDate.getTime())) {
              // Invalid date, fall back to exponential backoff
              const baseDelayMs = Math.pow(2, retries) * 1000;
              const jitterFactor = 0.75 + Math.random() * 0.5; // Random between 0.75 and 1.25
              retryAfterMs = baseDelayMs * jitterFactor;
            } else {
              retryAfterMs = Math.max(0, retryDate.getTime() - Date.now());
            }
          }
        } else {
          // No Retry-After header - use aggressive exponential backoff
          // Start at 1 second, grow rapidly: 1s, 2s, 4s, 8s, 16s, 32s, 64s
          const baseDelayMs = Math.pow(2, retries) * 1000;
          
          // Add jitter (random ±25%) to prevent thundering herd
          // If multiple clients hit 429 at the same time, they'll retry at different times
          const jitterFactor = 0.75 + Math.random() * 0.5; // Random between 0.75 and 1.25
          retryAfterMs = baseDelayMs * jitterFactor;
        }

        // Cap at maxRetryDelayMs
        retryAfterMs = Math.min(maxRetryDelayMs, retryAfterMs);

        if (totalElapsedTime + retryAfterMs >= maxRetryTimeMs) {
          log("error", `Max retry time exceeded for ${endpoint}`);
          break;
        }

        log(
          "warn",
          `Rate limited (429) on ${endpoint}. Retrying after ${(retryAfterMs/1000).toFixed(2)} seconds... (attempt ${retries + 1})`,
        );
        
        await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
        totalElapsedTime += retryAfterMs;
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
    `Max retry time of ${maxRetryTimeMs/1000} seconds exceeded for ${endpoint}`,
  );
}
