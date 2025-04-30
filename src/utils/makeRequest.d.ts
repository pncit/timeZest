import { apiEndpoint } from "../constants/endpoints.d";
import { LogLevel } from "./logger.d";

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
export function makeRequest<T>(
  log: (level: LogLevel, message: string, data?: any) => void,
  apiKey: string,
  baseUrl: string,
  endpoint: apiEndpoint,
  method: "GET" | "POST",
  data: any,
  maxRetryTimeMs: number,
  maxRetryDelayMs: number,
): Promise<T>;
