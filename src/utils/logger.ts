import { Logger, LogLevel } from "./logger.d";

export const logLevelPriority: Record<LogLevel, number> = {
  silent: -1,
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

export const defaultLogger: Logger = {
  silent: (_message: string, _data?: any) => {},
  error: (message: string, data?: any) =>
    data ? console.error(message, data) : console.error(message),
  warn: (message: string, data?: any) =>
    data ? console.warn(message, data) : console.warn(message),
  info: (message: string, data?: any) =>
    data ? console.info(message, data) : console.info,
  http: (message: string, data?: any) =>
    data ? console.log(message, data) : console.log(message),
  verbose: (message: string, data?: any) =>
    data ? console.debug(message, data) : console.debug(message),
  debug: (message: string, data?: any) =>
    data ? console.debug(message, data) : console.debug(message),
  silly: (message: string, data?: any) =>
    data ? console.debug(message, data) : console.debug(message),
};

export function buildLogger(
  logger: Logger,
  logLevel: LogLevel,
): (level: LogLevel, message: string, data?: any) => void {
  return (level: LogLevel, message: string, data?: any): void => {
    if (logLevelPriority[level] <= logLevelPriority[logLevel]) {
      logger[level](message, data);
    }
  };
}

export function withLogging<T>(
  fn: (...args: any[]) => Promise<T>,
  instance: { log: (level: LogLevel, message: string, data?: any) => void },
  functionName: string,
): (...args: any[]) => Promise<T> {
  return async (...args: any[]) => {
    instance.log("debug", `Entering ${functionName}`);
    args ? instance.log("silly", `Entering ${functionName}`, { args }) : null;
    try {
      const result = await fn(...args);
      instance.log("debug", `Exiting ${functionName} successfully`);
      result
        ? instance.log("silly", `Exiting ${functionName} successfully`, {
            result,
          })
        : null;
      return result;
    } catch (error) {
      instance.log("error", `Error in ${functionName}`, { error });
      throw error;
    }
  };
}
