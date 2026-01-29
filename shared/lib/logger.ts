type LogLevel = "debug" | "info" | "warn" | "error";
type LogMetadata = Record<string, unknown>;

interface LoggerConfig {
  isDevelopment: boolean;
  minLogLevel: LogLevel;
  enableStackTrace: boolean;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private config: LoggerConfig;

  constructor() {
    this.config = {
      isDevelopment: process.env.NODE_ENV === "development",
      minLogLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || "info",
      enableStackTrace: process.env.NODE_ENV === "development",
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLogLevel];
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    metadata?: LogMetadata
  ): void {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (this.config.isDevelopment) {
      switch (level) {
        case "debug":
          console.log(`${prefix} ${message}`, metadata || "");
          break;
        case "info":
          console.info(`${prefix} ${message}`, metadata || "");
          break;
        case "warn":
          console.warn(`${prefix} ${message}`, metadata || "");
          break;
        case "error":
          console.error(`${prefix} ${message}`, metadata || "");
          break;
      }
    } else {
      const logEntry = {
        timestamp,
        level,
        message,
        ...(metadata && { metadata }),
        environment: process.env.NODE_ENV,
      };

      if (level === "error") {
        console.error(JSON.stringify(logEntry));
      } else {
        console.log(JSON.stringify(logEntry));
      }
    }
  }

  debug(message: string, metadata?: LogMetadata): void {
    this.formatMessage("debug", message, metadata);
  }

  info(message: string, metadata?: LogMetadata): void {
    this.formatMessage("info", message, metadata);
  }

  warn(message: string, metadata?: LogMetadata): void {
    this.formatMessage("warn", message, metadata);
  }
  error(
    message: string,
    error?: Error | unknown,
    metadata?: LogMetadata
  ): void {
    const errorMetadata: LogMetadata = {
      ...metadata,
    };

    if (error instanceof Error) {
      errorMetadata.errorName = error.name;
      errorMetadata.errorMessage = error.message;
      if (this.config.enableStackTrace) {
        errorMetadata.stack = error.stack;
      }
    } else if (error) {
      errorMetadata.error = error;
    }

    this.formatMessage("error", message, errorMetadata);

    if (!this.config.isDevelopment && error instanceof Error) {
    }
  }

  logApiCall(
    method: string,
    endpoint: string,
    status?: number,
    duration?: number
  ): void {
    this.info(`API ${method} ${endpoint}`, {
      method,
      endpoint,
      status,
      duration,
    });
  }
  logConnection(
    type: "signalr" | "websocket",
    event: string,
    details?: LogMetadata
  ): void {
    this.info(`${type.toUpperCase()} ${event}`, details);
  }
  logUserAction(action: string, details?: LogMetadata): void {
    this.info(`User action: ${action}`, details);
  }
}

export const logger = new Logger();

export { Logger };
