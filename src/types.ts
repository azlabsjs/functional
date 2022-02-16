export type IterableType<T> =
  | Generator<T, any, any>
  | Iterable<T>
  | T[]
  | IterableIterator<T>
  | ReadonlyArray<T>
  | Set<T>
  | ReadonlySet<T>;
export type Function_ = (...params: any[]) => any;
export type UnaryFunction<T, R> = (p: T, index?: number) => R;
export type ReducerFunc<T, R> = (previous: R, current: T, index?: number) => R;
export type Predicate<T> = (p: T, index?: number) => boolean;
export type CollectorFunc<T, R> = (value: IterableType<T>) => R;
export type ComposeFunc<T, R> = (...funcs: Function_[]) => (source: T) => R;
