import { apiEndpoint } from "../constants/endpoints.d";
import { TimeZestAPI } from "../../index.d";

/**
 * Makes a paginated API request.
 * @template T - The type of the response data.
 * @param apiInstance - The instance of the TimeZestAPI.
 * @param endpoint - The API endpoint to call.
 * @param method - The HTTP method (GET or POST).
 * @param data - The request payload.
 * @param filter - An optional filter string.
 * @returns A promise that resolves to an array of response data.
 */
export function makePaginatedRequest<T>(
  apiInstance: TimeZestAPI,
  endpoint: apiEndpoint,
  method?: "GET" | "POST",
  data?: any,
  filter?: string | null,
): Promise<T[]>;
