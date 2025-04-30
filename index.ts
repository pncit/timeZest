import {
  TimeZestAPI as TimeZestAPIInterface,
  TimeZestAPIOptions,
  TimeZestAPIConfig,
  LogLevel,
  Agent,
  AppointmentType,
  Resource,
  SchedulingRequest,
  Team,
} from "./index.d";

import {
  ResourceSchema,
  AgentSchema,
  AppointmentTypeSchema,
  SchedulingRequestSchema,
  TeamSchema,
} from "./src/entities/schemas";
import { CONFIG } from "./src/config/config";
import { makeRequest } from "./src/utils/makeRequest";
import { API_ENDPOINTS } from "./src/constants/endpoints";
import { buildLogger, withLogging } from "./src/utils/logger";
import { makePaginatedRequest } from "./src/utils/makePaginatedRequest";

class TimeZestAPI implements TimeZestAPIInterface {
  private config: TimeZestAPIConfig;
  private apiKey: string;
  log: (level: LogLevel, message: string, data?: any) => void;

  constructor(apiKey: string, options?: TimeZestAPIOptions) {
    this.apiKey = apiKey;
    this.config = {
      logLevel: options?.logLevel || CONFIG.logLevel,
      logger: options?.logger || CONFIG.logger,
      baseUrl: options?.baseUrl || CONFIG.baseUrl,
      maxRetryDelayMs: options?.maxRetryDelayMs || CONFIG.maxRetryDelayMs,
      maxRetryTimeMs: options?.maxRetryTimeMs || CONFIG.maxRetryTimeMs,
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

  getApiKey(): string {
    return this.apiKey;
  }

  getConfig(): TimeZestAPIConfig {
    return this.config;
  }

  getResources = async (filter: string | null = null): Promise<Resource[]> => {
    const response = await makePaginatedRequest<Resource>(
      this,
      API_ENDPOINTS.RESOURCES,
      "GET",
      null,
      filter,
    );
    return response.map((item) => ResourceSchema.parse(item));
  };

  async getAgents(filter: string | null = null): Promise<Agent[]> {
    const response = await makePaginatedRequest<Agent>(
      this,
      API_ENDPOINTS.AGENTS,
      "GET",
      null,
      filter,
    );
    return response.map((item) => AgentSchema.parse(item));
  }

  async getTeams(filter: string | null = null): Promise<Team[]> {
    const response = await makePaginatedRequest<Team>(
      this,
      API_ENDPOINTS.TEAMS,
      "GET",
      null,
      filter,
    );
    return response.map((item) => TeamSchema.parse(item));
  }

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
    return response.map((item) => AppointmentTypeSchema.parse(item));
  }

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
    return response.map((item) => SchedulingRequestSchema.parse(item));
  }

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
}

export default TimeZestAPI;
