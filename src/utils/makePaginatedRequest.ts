import { makeRequest } from "./makeRequest";
import { handleError } from "./handleError";
import { apiEndpoint } from "../constants/endpoints";
import { TimeZestAPI } from "../index";
import { TQLFilter, normalizeFilter } from "./tqlFilter";

/**
 * Makes a paginated API request.
 * @template T - The type of the response data.
 * @param apiInstance - The instance of the TimeZestAPI.
 * @param endpoint - The API endpoint to call.
 * @param method - The HTTP method (GET or POST).
 * @param data - The request payload.
 * @param filter - An optional filter string or TQLFilter instance.
 * @returns A promise that resolves to an array of response data.
 */
export const makePaginatedRequest = async <T>(
  apiInstance: TimeZestAPI,
  endpoint: apiEndpoint,
  method: "GET" | "POST" = "GET",
  data: any = null,
  filter: TQLFilter | string | null = null,
): Promise<T[]> => {
  const { log } = apiInstance;
  const apiKey = apiInstance.getApiKey();
  const { baseUrl, maxRetryTimeMs, maxRetryDelayMs } = apiInstance.getConfig();

  let results: any[] = [];
  let nextPage: number | null = 1;

  try {
    do {
      log("debug", `Fetching page ${nextPage} for ${endpoint}`);
      const response: { data: any[]; next_page: number | null } =
        await makeRequest<{
          data: any[];
          next_page: number | null;
        }>(
          log,
          apiKey,
          baseUrl,
          endpoint,
          method,
          { ...data, filter: normalizeFilter(filter), page: nextPage },
          maxRetryTimeMs,
          maxRetryDelayMs,
        );

      log("http", `Page ${nextPage} fetched successfully for ${endpoint}`);
      results = results.concat(response.data);
      nextPage = response.next_page;
    } while (nextPage);

    log("http", `Paginated request to ${endpoint} completed successfully`);
    return results;
  } catch (error: any) {
    log(
      "error",
      `Paginated request to ${endpoint} failed with error: '${error.message}'`,
    );
    handleError(log, error);
  }
  return results;
};
