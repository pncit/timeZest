import { makeRequest } from "./makeRequest";
import { handleError } from "./handleError";
import { makePaginatedRequest as MakePaginatedRequestType } from "./makePaginatedRequest.d";

export const makePaginatedRequest: typeof MakePaginatedRequestType = async (
  apiInstance,
  endpoint,
  method = "GET",
  data = null,
  filter = null,
) => {
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
          { ...data, filter, page: nextPage },
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
