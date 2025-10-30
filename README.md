# TimeZest Node.js Module

This Node.js module provides a convenient and fully-typed interface for interacting with the [TimeZest API](https://developer.timezest.com/). It abstracts away the complexities of making HTTP requests, handling pagination, and managing API configurations, allowing developers to focus on building their applications.

## Features

- Simplified API interaction with the TimeZest API.
- Built-in support for logging and error handling.
- Automatic handling of paginated responses.
- Built-in support for request retries
- Fully typed with TypeScript for enhanced developer experience.

## Installation

Install the module using npm:

```bash
npm install timezest
```

## Getting Started

### Authentication and Configuration

To use the TimeZest API, you need an API key. Generate one from your TimeZest account under the API Keys section. Use the `TimeZestAPI` class to configure and interact with the API:

```typescript
import TimeZestAPI from "./index";

const apiKey = "your-api-key";

const timeZest = new TimeZestAPI(apiKey);
```

### Example Usage

#### Retrieve Agents

```typescript
async function fetchAgents() {
  try {
    const agents = await timeZest.getAgents();
    console.log("Agents:", agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
  }
}

fetchAgents();
```

#### Create a Scheduling Request

```typescript
async function createSchedulingRequest() {
  try {
    const request = await timeZest.createSchedulingRequest({
      appointment_type_id: "12345",
      end_user_email: "user@example.com",
      end_user_name: "John Doe",
      resources: [],
      scheduled_agents: [],
      selected_start_time: new Date().toISOString(),
      selected_time_zone: "UTC",
    });
    console.log("Created Scheduling Request:", request);
  } catch (error) {
    console.error("Error creating scheduling request:", error);
  }
}

createSchedulingRequest();
```

### Supported Endpoints

The `TimeZestAPI` supports the following methods for interacting with the TimeZest public API:

```typescript
// Retrieve all agents
timeZest.getAgents(filter: string | null = null): Promise<Agent[]>

// Retrieve all appointment types
timeZest.getAppointmentTypes(filter: string | null = null): Promise<AppointmentType[]>

// Retrieve all resources
timeZest.getResources(filter: string | null = null): Promise<Resource[]>

// Retreive all scheduling reuests
timeZest.getSchedulingRequests(filter: string | null = null): Promise<SchedulingRequest[]>

// Retrieve a scheduling request by id
timeZest.getSchedulingRequest(id: string): Promise<SchedulingRequest>

// Create a scheduling request
timeZest.createSchedulingRequest(data: SchedulingRequest): Promise<SchedulingRequest>

// Retrieve all teams
timeZest.getTeams(filter: string | null = null): Promise<Team[]>
```

### Filtering Requests

Pass TQL statements into the request to filter your results

```typescript
async function fetchTier1Team() {
  try {
    const teams = await timeZest.getTeams("team.internal_name EQ Tier1");
    console.log("Teams:", teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
}

fetchTier1Team();
```

### Paginated Requests

For endpoints that return paginated data, the library automatically handles pagination:

```typescript
async function fetchAllResources() {
  try {
    const resources = await timeZest.getResources();
    console.log("Resources:", resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
  }
}

fetchAllResources();
```

## Rate Limiting and Retry Logic

The `TimeZestAPI` class includes intelligent retry logic optimized for TimeZest's API limits. TimeZest enforces a **maximum of 180 requests in any 60-second sliding window**.

### Retry Strategy

When a request fails due to rate limiting (429 Too Many Requests), the library automatically retries with an optimized strategy:

- **Aggressive Exponential Backoff**: Starts at 1 second and doubles with each retry (1s, 2s, 4s, 8s, 16s, 32s, 64s...)
- **Jitter**: Adds ±25% random variation to retry delays to prevent a thundering herd problem when multiple clients hit rate limits simultaneously
- **Retry-After Header**: Always respects the `Retry-After` header from 429 responses when provided by the API
- **Patient by Default**: Will retry for up to 5 minutes by default, allowing time for rate limit windows to clear
- **Configurable**: Full control over retry behavior via configuration options

### Configuration Options

You can configure the retry behavior using the following options when initializing the class:

- **`maxRetryTimeMs`**: The maximum amount of time (in milliseconds) to spend retrying a request. Defaults to 5 minutes (300,000ms).
- **`maxRetryDelayMs`**: The maximum delay (in milliseconds) between individual retry attempts. Defaults to 60 seconds (60,000ms).

### Example Configuration

```typescript
const options = {
  maxRetryTimeMs: 10 * 60 * 1000, // Retry for up to 10 minutes
  maxRetryDelayMs: 60 * 1000, // Max 60 seconds between retries
  logLevel: "debug", // See detailed retry information in logs
};

const timeZest = new TimeZestAPI("your-api-key", options);
```

### Retry Behavior Example

If you hit a rate limit without a `Retry-After` header, the retry delays will be:

- 1st retry: ~1 second (0.75-1.25s with jitter)
- 2nd retry: ~2 seconds (1.5-2.5s with jitter)
- 3rd retry: ~4 seconds (3-5s with jitter)
- 4th retry: ~8 seconds (6-10s with jitter)
- 5th retry: ~16 seconds (12-20s with jitter)
- 6th retry: ~32 seconds (24-40s with jitter)
- 7th+ retry: ~60 seconds (45-60s with jitter, capped at maxRetryDelayMs)

The jitter ensures that if multiple clients hit the rate limit at the same time, they won't all retry simultaneously.

## Logging

The `TimeZestAPI` class includes built-in logging. By default, it uses `console` for logging. You can configure the log level using the `logLevel` option when initializing the class. Supported log levels include `silent`, `error`, `warn`, `info`, and `debug`.

You can also pass a custom logger by providing a `logger` object with methods corresponding to the log levels (e.g., `info`, `error`, etc.).

Example:

```typescript
const customLogger = {
  info: (message: string, data?: any) => {
    /* custom implementation */
  },
  error: (message: string, data?: any) => {
    /* custom implementation */
  },
  // ...other log levels
};

const options = {
  logger: customLogger,
  logLevel: "info",
};

const timeZest = new TimeZestAPI(apiKey, options);

timeZest.log("info", "This is an informational message");
timeZest.log("error", "This is an error message");
```

## Documentation

For detailed API documentation, visit the [TimeZest API Documentation](https://developer.timezest.com/).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
