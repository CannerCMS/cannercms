import { level, Logger } from './interface';

export class JsonLogger implements Logger {
  public log = (levelType: level = level.info, payload?: any) => {
    // tslint:disable-next-line:no-console
    console.log(JSON.stringify({
      time: new Date().toISOString(),
      level: levelType,
      ...payload
    }));
  }

  public error = (levelType: level = level.error, payload: any) => {
    // tslint:disable-next-line:no-console
    console.error(JSON.stringify({
      time: new Date().toISOString(),
      level: level.error,
      ...payload
    }));
  }

  public info = (payload: any) => {
    this.log(level.info, payload);
  }

  public debug = (payload: any) => {
    this.log(level.debug, payload);
  }

  public warn = (payload: any) => {
    this.log(level.warn, payload);
  }

  public fatal = (payload: any) => {
    this.error(level.fatal, payload);
  }
}

export const jsonLogger = new JsonLogger();
