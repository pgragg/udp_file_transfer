export class Logger {
  private static get shouldLog() { return process.env['DEBUG_LOG'] === 'true' }

  public static log(message: any, ...optionalParams: any[]) {
    if (!Logger.shouldLog) {
      return;
    }

    optionalParams ? console.log(message, optionalParams) : Logger.log(message);
  }

  public static info(message: any, data?: any) {
    if (!Logger.shouldLog) {
      return;
    }

    data ? console.info(message, data) : console.info(message);
  }

  public static error(message: any, data?: any) {
    if (!Logger.shouldLog) {
      return;
    }

    data ? console.error(message, data) : console.error(message);
  }
}
