export type Success<T> = { success: true; value: T };
export type Failure = { success: false; error: string; originalError?: any };
export type Result<T> = Success<T> | Failure;

export async function safeAsync<T>(
  promise: Promise<T>,
  errorMessage: string
): Promise<Result<T>> {
  try {
    const value = await promise;
    return Ok(value);
  } catch (error) {
    return Err(errorMessage, error);
  }
}

export function Ok<T>(value: T): Success<T> {
  return { success: true, value };
}

export function Err<E>(error: string, originalError?: E): Failure {
  return { success: false, error, originalError };
}
