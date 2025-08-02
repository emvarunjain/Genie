import { format } from 'util';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

class Logger {
  private static instance: Logger;
  private currentLevel: LogLevel = 'INFO';
  
  private readonly levelPriority: Record<LogLevel, number> = {
    'DEBUG': 0,
    'INFO': 1,
    'WARNING': 2,
    'ERROR': 3,
    'CRITICAL': 4
  };

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLevel(level: LogLevel) {
    this.currentLevel = level;
    this.info(`Log level set to ${level}`);
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.currentLevel];
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.map(arg => {
      if (arg instanceof Error) {
        // For Error objects, we want the stack trace for better debugging.
        return `\n${arg.stack}`;
      }
      if (typeof arg === 'object' && arg !== null) {
        return '\n' + JSON.stringify(arg, null, 2);
      }
      return arg;
    });
    
    return `[${timestamp}] [${level}] ${format(message, ...formattedArgs)}`;
  }

  debug(message: string, ...args: any[]) {
    if (this.shouldLog('DEBUG')) {
      console.debug(this.formatMessage('DEBUG', message, ...args));
    }
  }

  info(message: string, ...args: any[]) {
    if (this.shouldLog('INFO')) {
      console.info(this.formatMessage('INFO', message, ...args));
    }
  }

  warning(message: string, ...args: any[]) {
    if (this.shouldLog('WARNING')) {
      console.warn(this.formatMessage('WARNING', message, ...args));
    }
  }

  error(message: string, ...args: any[]) {
    if (this.shouldLog('ERROR')) {
      console.error(this.formatMessage('ERROR', message, ...args));
    }
  }

  critical(message: string, ...args: any[]) {
    if (this.shouldLog('CRITICAL')) {
      console.error(this.formatMessage('CRITICAL', message, ...args));
    }
  }

  // Helper for logging HTTP requests
  logRequest(method: string, url: string, body?: any) {
    this.debug(`${method} Request to ${url}`, {
      method,
      url,
      body: body || 'No body'
    });
  }

  // Helper for logging HTTP responses
  logResponse(method: string, url: string, status: number, data: any) {
    this.debug(`${method} Response from ${url} (${status})`, {
      method,
      url,
      status,
      data
    });
  }
}

export const logger = Logger.getInstance(); 