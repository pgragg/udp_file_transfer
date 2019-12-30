export type SimpleResult<TSuccess, TFailure> =
  | { success: TSuccess; failure?: undefined }
  | { success?: undefined; failure: TFailure };
