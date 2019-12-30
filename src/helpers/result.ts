export class Result {
    public static Failure(params: any) {
      return { failure: params };
    }
    public static Success(params: any) {
      return { success: params };
    }
  }
  