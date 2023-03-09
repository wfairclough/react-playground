export type Result<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: unknown;
    };

export const tryFn = <TArgs extends any[], TReturn>(func: (...args: TArgs) => TReturn) => {
  return (...args: TArgs): Result<TReturn> => {
    try {
      return {
        value: func(...args),
        ok: true,
      };
    } catch (e) {
      return {
        error: e,
        ok: false,
      };
    }
  };
};
