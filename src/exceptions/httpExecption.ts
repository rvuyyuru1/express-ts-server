export class HttpException extends Error {
  public status: number;
  public message: string;
  public method: string;
  public path: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}
