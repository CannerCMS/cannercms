
export enum level {
  info = 'INFO',
  debug = 'DEBUG',
  warn = 'WARN',
  error = 'ERROR',
  fatal = 'FATAL',
}

export interface Logger {
  log(levelType: level, payload?: any): void;
  info(payload: any): void;
  debug(payload: any): void;
  warn(payload: any): void;
  fatal(payload: any): void;
  error(payload: any): void;
}

export enum phase {
  pending = 'pending',

  // Indicates whether the Container is running
  live = 'live',

  // Indicates whether the Container is ready to service requests.
  ready = 'ready',

  failed = 'failed'
}

export interface ServerStatus {
  phase: phase;
}

export interface WebService<StartConfig> {
  start(config: StartConfig): Promise<void>;

  // logger
  setLogger(logger: Logger): void;
  getLogger(): Logger;

  // status
  getStatus(): ServerStatus;
}
