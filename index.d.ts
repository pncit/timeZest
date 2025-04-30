import { LogLevel, Logger } from "./logger.js";
export { LogLevel, Logger } from "./logger.js";
export {
  Agent,
  AppointmentType,
  Resource,
  SchedulingRequest,
  Team,
} from "./src/entities/entities.d";
export { TimeZestAPIConfig } from "./src/config/config.d";

/**
 * Represents the main interface for the TimeZest API.
 */
export interface TimeZestAPI {
  /**
   * Logs a message with a specified log level.
   * @param level - The log level (e.g., 'info', 'debug').
   * @param message - The message to log.
   * @param data - Optional additional data to log.
   */
  log: (level: LogLevel, message: string, data?: any) => void;

  /**
   * Retrieves a list of resources, optionally filtered by a query.
   * @param filter - An optional filter string in TQL format
   * @returns A promise that resolves to an array of resources.
   */
  getResources(filter?: string | null): Promise<Resource[]>;

  /**
   * Retrieves a list of agents, optionally filtered by a query.
   * @param filter - An optional filter string in TQL format
   * @returns A promise that resolves to an array of agents.
   */
  getAgents(filter?: string | null): Promise<Agent[]>;

  /**
   * Retrieves a list of teams, optionally filtered by a query.
   * @param filter - An optional filter string in TQL format
   * @returns A promise that resolves to an array of teams.
   */
  getTeams(filter?: string | null): Promise<Team[]>;

  /**
   * Retrieves a list of appointment types, optionally filtered by a query.
   * @param filter - An optional filter string in TQL format
   * @returns A promise that resolves to an array of appointment types.
   */
  getAppointmentTypes(filter?: string | null): Promise<AppointmentType[]>;

  /**
   * Retrieves a specific scheduling request by its ID.
   * @param id - The ID of the scheduling request.
   * @returns A promise that resolves to the scheduling request.
   */
  getSchedulingRequest(id: string): Promise<SchedulingRequest>;

  /**
   * Retrieves a list of scheduling requests, optionally filtered by a query.
   * @param filter - An optional filter string in TQL format
   * @returns A promise that resolves to an array of scheduling requests.
   */
  getSchedulingRequests(filter?: string | null): Promise<SchedulingRequest[]>;

  /**
   * Creates a new scheduling request.
   * @param data - The data for the new scheduling request.
   * @returns A promise that resolves to the created scheduling request.
   */
  createSchedulingRequest(data: SchedulingRequest): Promise<SchedulingRequest>;

  /**
   * Retrieves the API key.
   * @returns The API key as a string.
   */
  getApiKey(): string;

  /**
   * Retrieves the configuration object.
   * @returns The configuration object.
   */
  getConfig(): TimeZestAPIConfig;
}

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
}
