export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
}

export class ApiResponseUtil {
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return { success: true, data, message };
  }

  static successMessage(message: string): ApiResponse {
    return { success: true, message };
  }

  static list<T>(data: T[], message?: string): ApiResponse<T[]> {
    return { success: true, data, total: data.length, message };
  }
}
