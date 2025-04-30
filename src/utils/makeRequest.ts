import axios from "axios";
import { handleError } from "./handleError";
import { makeRequest as MakeRequestType } from "./makeRequest.d";

export const makeRequest: typeof MakeRequestType = async (
  log,
  apiKey,
  baseUrl,
  endpoint,
  method = "GET",
  data = null,
  maxRetryTimeMs,
  maxRetryDelayMs,
) => {
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
