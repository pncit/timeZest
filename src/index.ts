import { log, LogLevel, Logger } from "./utils/logger";
import { TimeZestAPIConfig } from "./config/config";
import {
  Agent,
  Resource,
  AppointmentType,
  SchedulingRequest,
  Team,
} from "./entities/entities";
import {
  ResourceSchema,
  AgentSchema,
  AppointmentTypeSchema,
  SchedulingRequestSchema,
  TeamSchema,
} from "./entities/schemas";
import { CONFIG } from "./config/config";
import { makeRequest } from "./utils/makeRequest";
import { API_ENDPOINTS } from "./constants/endpoints";
import { buildLogger, withLogging } from "./utils/logger";
import { makePaginatedRequest } from "./utils/makePaginatedRequest";
import { ZodSchema } from "zod";

export { Agent, Resource, AppointmentType, SchedulingRequest, Team } from "./entities/entities";
export { ResourceSchema, AgentSchema, AppointmentTypeSchema, SchedulingRequestSchema, TeamSchema } from "./entities/schemas";

/**
 * Options for configuring the TimeZest API.
 */
export interface TimeZestAPIOptions {
  /** The log level for the API (e.g., 'info', 'debug'). */
  logLevel?: LogLevel;

  /** A custom logger implementation. */
  logger?: Logger;

  /** The base URL for the API. */
  baseUrl?: string;

  /** The maximum delay between retries, in milliseconds. */
  maxRetryDelayMs?: number;

  /** The maximum total retry time, in milliseconds. */
  maxRetryTimeMs?: number;

  /** Whether to use Zod validation for API responses. */
  outputValidation?: boolean;
}

/**
 * Represents the TimeZest API client.
 * Provides methods to interact with the TimeZest API.
 */
export class TimeZestAPI {
  private config: TimeZestAPIConfig;
  private apiKey: string;
  log: log;

  /**
   * Creates an instance of the TimeZestAPI client.
   * @param apiKey - The API key for authenticating with the TimeZest API.
   * @param options - Optional configuration options for the API client.
   */
  constructor(apiKey: string, options?: TimeZestAPIOptions) {
    this.apiKey = apiKey;
    this.config = {
      logLevel: options?.logLevel || CONFIG.logLevel,
      logger: options?.logger || CONFIG.logger,
      baseUrl: options?.baseUrl || CONFIG.baseUrl,
      maxRetryDelayMs: options?.maxRetryDelayMs || CONFIG.maxRetryDelayMs,
      maxRetryTimeMs: options?.maxRetryTimeMs || CONFIG.maxRetryTimeMs,
      outputValidation: options?.outputValidation !== undefined ? options.outputValidation : CONFIG.outputValidation
    };
    this.log = buildLogger(this.config.logger, this.config.logLevel);
    // Log the initialization of the API client but remove apiKey
    this.log("info", "TimeZestAPI initialized");
    this.log("debug", "TimeZestAPI initialized with custom config", {
      ...options,
    });
    this.log("debug", "TimeZestAPI initialized with final config", {
      ...this.config,
    });

    // Wrap methods with logging middleware using the instance's log method
    this.getResources = withLogging(
      this.getResources.bind(this),
      this,
      "getResources",
    );
    this.getAgents = withLogging(this.getAgents.bind(this), this, "getAgents");
    this.getTeams = withLogging(this.getTeams.bind(this), this, "getTeams");
    this.getAppointmentTypes = withLogging(
      this.getAppointmentTypes.bind(this),
      this,
      "getAppointmentTypes",
    );
    this.getSchedulingRequest = withLogging(
      this.getSchedulingRequest.bind(this),
      this,
      "getSchedulingRequest",
    );
    this.createSchedulingRequest = withLogging(
      this.createSchedulingRequest.bind(this),
      this,
      "createSchedulingRequest",
    );
  }

  /**
   * Retrieves the API key used by the client.
   * @returns The API key.
   */
  getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Retrieves the configuration of the API client.
   * @returns The API client configuration.
   */
  getConfig(): TimeZestAPIConfig {
    return this.config;
  }

  /**
   * Fetches resources from the TimeZest API.
   * @param filter - Optional filter string to narrow down results.
   * @returns A promise that resolves to an array of resources.
   */
  getResources = async (filter: string | null = null): Promise<Resource[]> => {
    const response = await makePaginatedRequest<Resource>(
      this,
      API_ENDPOINTS.RESOURCES,
      "GET",
      null,
      filter,
    );
    return this.validateResponse(response, ResourceSchema);
  };

  /**
   * Fetches agents from the TimeZest API.
   * @param filter - Optional filter string to narrow down results.
   * @returns A promise that resolves to an array of agents.
   */
  async getAgents(filter: string | null = null): Promise<Agent[]> {
    const response = await makePaginatedRequest<Agent>(
      this,
      API_ENDPOINTS.AGENTS,
      "GET",
      null,
      filter,
    );
    return this.validateResponse(response, AgentSchema);
  }

  /**
   * Fetches teams from the TimeZest API.
   * @param filter - Optional filter string to narrow down results.
   * @returns A promise that resolves to an array of teams.
   */
  async getTeams(filter: string | null = null): Promise<Team[]> {
    const response = await makePaginatedRequest<Team>(
      this,
      API_ENDPOINTS.TEAMS,
      "GET",
      null,
      filter,
    );
    return this.validateResponse(response, TeamSchema);
  }

  /**
   * Fetches appointment types from the TimeZest API.
   * @param filter - Optional filter string to narrow down results.
   * @returns A promise that resolves to an array of appointment types.
   */
  async getAppointmentTypes(
    filter: string | null = null,
  ): Promise<AppointmentType[]> {
    const response = await makePaginatedRequest<AppointmentType>(
      this,
      API_ENDPOINTS.APPOINTMENT_TYPES,
      "GET",
      null,
      filter,
    );
    return this.validateResponse(response, AppointmentTypeSchema);
  }

  /**
   * Fetches a scheduling request by its ID.
   * @param id - The ID of the scheduling request.
   * @returns A promise that resolves to the scheduling request.
   */
  async getSchedulingRequest(id: string): Promise<SchedulingRequest> {
    const response = await makeRequest<SchedulingRequest>(
      this.log,
      this.apiKey,
      this.config.baseUrl,
      `${API_ENDPOINTS.SCHEDULING_REQUESTS}/${id}`,
      "GET",
      null,
      this.config.maxRetryTimeMs,
      this.config.maxRetryDelayMs,
    );
    return SchedulingRequestSchema.parse(response);
  }

  /**
   * Fetches scheduling requests from the TimeZest API.
   * @param filter - Optional filter string to narrow down results.
   * @returns A promise that resolves to an array of scheduling requests.
   */
  async getSchedulingRequests(
    filter: string | null = null,
  ): Promise<SchedulingRequest[]> {
    const response = await makePaginatedRequest<SchedulingRequest>(
      this,
      API_ENDPOINTS.SCHEDULING_REQUESTS,
      "GET",
      null,
      filter,
    );
    return this.validateResponse(response, SchedulingRequestSchema);
  }

  /**
   * Creates a new scheduling request.
   * @param data - The data for the scheduling request.
   * @returns A promise that resolves to the created scheduling request.
   */
  async createSchedulingRequest(
    data: SchedulingRequest,
  ): Promise<SchedulingRequest> {
    const response = await makeRequest<SchedulingRequest>(
      this.log,
      this.apiKey,
      this.config.baseUrl,
      API_ENDPOINTS.SCHEDULING_REQUESTS,
      "POST",
      data,
      this.config.maxRetryTimeMs,
      this.config.maxRetryDelayMs,
    );
    return response;
  }

  /**
   * Validates API responses using Zod schemas if outputValidation is enabled.
   * @param response - The API response data to validate.
   * @param schema - The Zod schema to validate against.
   * @returns The validated or raw response data.
   */
  private validateResponse<T>(response: T[], schema: ZodSchema): T[] {
    if (this.config.outputValidation) {
      return response.map((item) => schema.parse(item));
    }
    return response;
  }
}

export default TimeZestAPI;