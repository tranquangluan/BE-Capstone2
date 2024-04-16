import { ErrorDTO } from "../dtos/ErrorDTO";
import { messageFormat } from "./MessageFormatUtil";
import { AppErrorAction } from "./AppErrorAction";
import { ErrorType } from "./ErrorType";

export class AppError extends ErrorDTO {
  public readonly httpStatus: number;
  public readonly code: string;
  public readonly action: AppErrorAction;
  public readonly title: string;
  public readonly errorType: ErrorType;

  constructor(
    httpStatus: number,
    code: string,
    message: string,
    action: AppErrorAction,
    title: string,
    errorType: ErrorType,
  ) {
    super(code, message, action, title, errorType);
    this.httpStatus = httpStatus;
  }

  getHttpStatus(): number {
    return this.httpStatus;
  }

  getCode(): string {
    return this.code;
  }

  getMessage(...args: any[]): string {
    return messageFormat(this.message, args);
  }

  getErrorAction(): AppErrorAction {
    return this.action;
  }

  getTitle(): string {
    return this.title;
  }

  getErrorType(): ErrorType {
    return this.errorType;
  }
}
