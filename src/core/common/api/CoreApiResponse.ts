import { ErrorDTO } from "../dtos/ErrorDTO";
import { AppError } from "../exception/AppError";

export class ApiResponseMetadata {
  public readonly status: number;
  public readonly success: boolean;
  public readonly message?: string;
  public readonly error?: ErrorDTO;

  constructor(
    status: number,
    messageOrError: string | ErrorDTO,
    success?: boolean,
  ) {
    this.status = status;
    if (typeof messageOrError === "string") {
      this.message = messageOrError;
      this.success = success ?? true;
    } else if (messageOrError instanceof ErrorDTO) {
      this.error = messageOrError;
      this.success = false;
    } else this.success = true;
  }
}

export type TCoreApiResponse<T> = {
  metadata: ApiResponseMetadata;
  data?: T;
};

export class CoreApiResponse<T = undefined> implements TCoreApiResponse<T> {
  readonly metadata: ApiResponseMetadata;
  readonly data?: T;

  private constructor(
    status: number,
    messageOrError: string | ErrorDTO,
    data?: T,
    success?: boolean,
  ) {
    this.metadata = new ApiResponseMetadata(status, messageOrError, success);
    if (data) this.data = data;
  }

  getErrorDisplay(): string {
    if (this.metadata.message) return this.metadata.message;
    else if (this.metadata.error) {
      const error = this.metadata.error;
      return `${error.code}:${error.message}`;
    } else return "";
  }

  public static success<T>(data?: T, status?: number) {
    return new CoreApiResponse(status ?? 200, "Success", data, true);
  }

  public static appError<T>(appError: AppError, data?: T): CoreApiResponse<T> {
    return new CoreApiResponse(appError.getHttpStatus(), appError, data, false);
  }

  public static error<T>(
    status?: number,
    messageOrError?: string | ErrorDTO,
    data?: T,
  ) {
    return new CoreApiResponse(
      status ?? 500,
      messageOrError ?? "Intenal Server Error",
      data,
      false,
    );
  }
}
export class CoreApiResponse1<T1 = undefined, T2 = undefined> {
  readonly metadata: ApiResponseMetadata;
  readonly data1: T1;
  readonly data2: T2;
  private constructor(
    status: number,
    messageOrError: string | ErrorDTO,
    data1: T1,
    data2: T2,
    success?: boolean,
  ) {
    this.metadata = new ApiResponseMetadata(status, messageOrError,success);
    this.data1 = data1;
    this.data2 = data2;
  }

  getErrorDisplay(): string {
    if (this.metadata.message) return this.metadata.message;
    else if (this.metadata.error) {
      const error = this.metadata.error;
      return `${error.code}:${error.message}`;
    } else return "";
  }

  public static success<T1, T2>(data1?: T1, data2?: T2, status?: number): CoreApiResponse1<T1, T2> {
    if (data1 !== undefined && data2 !== undefined) {
      return new CoreApiResponse1<T1, T2>(status ?? 200, "Success", data1, data2, true);
    } else if (data1 !== undefined) {
      return new CoreApiResponse1<T1, T2>(status ?? 200, "Success", data1, undefined, true);
    } else if (data2 !== undefined) {
      return new CoreApiResponse1<T1, T2>(status ?? 200, "Success", undefined, data2, true);
    } else {
      return new CoreApiResponse1<T1, T2>(status ?? 200, "Success", undefined, undefined, true);
    }
  }

  public static appError<T1, T2>(appError: AppError, data1?: T1, data2?: T2): CoreApiResponse1<T1, T2> {
    if (data1 !== undefined && data2 !== undefined) {
      return new CoreApiResponse1<T1, T2>(appError.getHttpStatus(), appError, data1, data2, false);
    } else if (data1 !== undefined) {
      return new CoreApiResponse1<T1, T2>(appError.getHttpStatus(), appError, data1, undefined, false);
    } else if (data2 !== undefined) {
      return new CoreApiResponse1<T1, T2>(appError.getHttpStatus(), appError, undefined, data2, false);
    } else {
      return new CoreApiResponse1<T1, T2>(appError.getHttpStatus(), appError, undefined, undefined, false);
    }
  }

  public static error<T1, T2>(
    status?: number,
    messageOrError?: string | ErrorDTO,
    data1?: T1,
    data2?: T2,
    success?: Boolean,
  ): CoreApiResponse1<T1, T2> {
    if (data1 !== undefined && data2 !== undefined) {
      return new CoreApiResponse1<T1, T2>(
        status ?? 500,
        messageOrError ?? "Internal Server Error",
        data1, data2,
        false,
      );
    } else if (data1 !== undefined) {
      return new CoreApiResponse1<T1, T2>(
        status ?? 500,
        messageOrError ?? "Internal Server Error",
        data1,undefined,
        false,
      );
    } else if (data2 !== undefined) {
      return new CoreApiResponse1<T1, T2>(
        status ?? 500,
        messageOrError ?? "Internal Server Error",
        undefined, data2,
        false,
      );
    } else {
      return new CoreApiResponse1<T1, T2>(
        status ?? 500,
        messageOrError ?? "Internal Server Error",
        undefined,undefined,
        false,
      );
    }
  }
}