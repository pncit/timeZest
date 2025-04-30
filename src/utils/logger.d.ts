export interface Logger {
  silent: (message: string, data?: any) => void;
  error: (message: string, data?: any) => void;
  warn: (message: string, data?: any) => void;
  info: (message: string, data?: any) => void;
  http: (message: string, data?: any) => void;
  verbose: (message: string, data?: any) => void;
  debug: (message: string, data?: any) => void;
  silly: (message: string, data?: any) => void;
}

export type LogLevel =
  | "silent"
  | "error"
  | "warn"
  | "info"
  | "http"
  | "verbose"
  | "debug"
  | "silly";
