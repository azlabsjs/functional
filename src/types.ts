// constants
// @internal
export const NOT_FOUND = '__NOT_FOUND__';
//!Ends Constants

export type IterableType<T> =
  | Generator<T, unknown, unknown>
  | Iterable<T>
  | T[]
  | IterableIterator<T>
  | ReadonlyArray<T>
  | Set<T>
  | ReadonlySet<T>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Function_ = (...params: any[]) => any;
export type UnaryFunction<T, R> = (p: T, index?: number) => R;
export type ReducerFunc<T, R> = (previous: R, current: T, index?: number) => R;
export type Predicate<T> = (p: T, index?: number) => boolean;
export type CollectorFunc<T, R> = (value: IterableType<T>) => R;
export type ComposeFunc<T, R> = (...funcs: Function_[]) => (source: T) => R;

// Types
//
// @internal
export type Compator<Params extends unknown[] = unknown[]> = (
  a: unknown,
  b: unknown,
  ...least: Params
) => boolean;

// @internal
export type CacheComparator = (
  prev: unknown[] | IArguments | undefined,
  next: unknown[] | IArguments | undefined
) => boolean;

// @internal
export type CacheKey = unknown[] | IArguments | undefined;

// @internal
export type CacheEntry = { key: CacheKey; value: unknown };

// @internal
export type CacheType = {
  get(key: CacheKey): unknown | typeof NOT_FOUND;
  set(key: CacheKey, value: unknown): void;
  entries: () => unknown;
  clear?: () => void;
};

// @internal
export type EqualityCacheOptions = {
  func: Compator;
  size?: number;
};

export type MemoizerOptions = {
  cacheFactory: {
    create(): CacheType;
  };
  equality: EqualityCacheOptions;
  hash?: boolean;
  strategy: (
    internal: (...args: unknown[]) => unknown,
    options: MemoizerOptions
  ) => unknown;
};
