type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function write(level: LogLevel, message: string, error?: unknown): void {
  if (level === 'debug' && process.env.DEBUG !== 'true' && process.env.DEBUG_VOICE !== 'true') return;

  const prefix = `[${new Date().toISOString()}] [${level.toUpperCase()}]`;

  if (error instanceof Error) {
    console[level](`${prefix} ${message}: ${error.stack ?? error.message}`);
    return;
  }

  if (error) {
    console[level](`${prefix} ${message}`, error);
    return;
  }

  console[level](`${prefix} ${message}`);
}

export const logger = {
  debug: (message: string) => write('debug', message),
  info: (message: string) => write('info', message),
  warn: (message: string, error?: unknown) => write('warn', message, error),
  error: (message: string, error?: unknown) => write('error', message, error),
};
