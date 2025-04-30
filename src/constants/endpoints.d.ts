/**
 * Defines the API endpoints used in the TimeZest application.
 */
export const API_ENDPOINTS: {
  /** Endpoint for managing resources. */
  RESOURCES: apiEndpoint;

  /** Endpoint for managing agents. */
  AGENTS: apiEndpoint;

  /** Endpoint for managing teams. */
  TEAMS: apiEndpoint;

  /** Endpoint for managing appointment types. */
  APPOINTMENT_TYPES: apiEndpoint;

  /** Endpoint for managing scheduling requests. */
  SCHEDULING_REQUESTS: apiEndpoint;
};

export type apiEndpoint =
  | "/resources"
  | "/agents"
  | "/teams"
  | "/appointment_types"
  | "/scheduling_requests"
  | `${apiEndpoint}/${string}`;

export type apiEndpoints = {
  RESOURCES: apiEndpoint;
  AGENTS: apiEndpoint;
  TEAMS: apiEndpoint;
  APPOINTMENT_TYPES: apiEndpoint;
  SCHEDULING_REQUESTS: apiEndpoint;
};
