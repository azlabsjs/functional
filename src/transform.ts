import { compose } from './compose';
import { IterableType, Predicate, ReducerFunc, UnaryFunction } from './types';

/**
 * Apply a transformation function on a given value and reduce it down to an output
 * using the reducer function
 *
 * @example
 *    mapReduce<number, number, number>(
 *        x => x * 3,
 *        (carr, curr) => {
 *          carr += curr;
 *          return carr;
 *        },
 *        0)(Stream.iterate(1, x => x + 1).take(10).collect(ListCollector))
 *
 * @param mapFunc
 * @param reducerFunc
 * @param initial
 * @returns
 */
export const mapReduce = <T, R, ReducerRType>(
  mapFunc: UnaryFunction<T, R>,
  reducerFunc: ReducerFunc<R, ReducerRType>,
  initial: ReducerRType
) =>
  compose(
    (source: T | T[]) =>
      Array.isArray(source) ? source.map(mapFunc) : mapFunc(source),
    (source: R | R[]) =>
      Array.isArray(source)
        ? source.reduce(reducerFunc, initial)
        : reducerFunc(initial, source)
  );

/**
 * Takes in a value an returns the same value as output
 *
 * @param value
 */

/**
 * @description Returns the exact value that was passed as
 * parameter. Utility function that can be used as replacement
 * for other transformation where there no need for transformation
 * 
 * @example
 * 
 * function dummyFunc<T>(value: number, fn?: (x: number) => T) {
 *    // In this example, dummyFunc accept as last parameter an optional
 *    // transformation function which in case it's not provided use
 *    // Identity as fallback
 *    fn = fn ?? Identity<T>;
 *    
 *    return fn(value);
 * }
 * 
 * @param value 
 */
export const Identity = <T>(value: unknown) => value as T;

/**
 * Calls the transformation function on user provided value
 *
 * @example
 *
 * const getEvenNumbersDoubled = (list: number[])  =>
 *    list.filter(x => x % 2).map(x => x * 2);
 * const result = MapTo([1...10], getEvenNumbersDoubled);
 *
 * @param value
 * @param fn
 */
export const MapTo = <T, RType>(
  value: T,
  fn: (value: T) => RType
) => fn(value);

/**
 * Calls user provided function on the provided value without returning result value
 *
 * @example
 *
 * Tap([1...10], (list: number[]) => {
 *  for(const item of list) {
 *      // Do something with the item
 *  }
 * });
 *
 * @param value
 * @param callback
 */
export const Tap = <T>(value: T, callback: (value: T) => any) => {
  callback(value);
};

/**
 * Functional interface for iterating over a list of items in an {@see IterableType<T>} object
 *
 * @example
 * Each([...], (x) => Order.process(x));
 *
 * @param list
 * @param fn
 */
export const Each = <T>(list: IterableType<T>, fn: (value: T) => any) => {
  for (const iterator of list) {
    fn(iterator);
  }
};

/**
 *
 * Functional interface for reducing a value to a given return value using a reducer function
 *
 * @example
 * const result = ReduceOne(1, (carry, current) => { carry += current; return carry; }, 3);
 *
 * @param value
 * @param reducer
 * @param initial
 * @returns
 */
export const ReduceOne = <T, RType>(
  value: T,
  reducer: ReducerFunc<T, RType>,
  initial: RType | T
) => {
  const carry = initial;
  return reducer(carry as RType, value);
};

/**
 * Functional interface for applying reduce function on {@see IterableType<T>} types
 *
 * @example
 *
 * function* generator() {
 *  let index = 1;
 *  while(index <= 10) {
 *      yield index;
 *      index++;
 *  }
 * }
 * const result = ReduceList(generator(), (carry, current) => { carry += current; return carry}, 0);
 *
 * @param list
 * @param reducer
 * @param initial
 * @returns
 */
export const Reduce = <T, RType>(
  list: IterableType<T>,
  reducer: ReducerFunc<T, RType>,
  initial: RType | T
) => {
  let carry = initial;
  for (const iterator of list) {
    carry = reducer(carry as RType, iterator);
  }
  return carry as ReturnType<typeof reducer>;
};

/**
 * Functional interface used for filtering iterables|list of values {@see IterableType<T>} by applying
 * a predicate.
 *
 * Note: It produces a generator that can be converted to Set, Array, etc... by passing a collector
 * function or by wrapping the return value in a collector function
 *
 * @example
 * const values = Filter(
 *  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
 *   x => x % 2 === 0,
 *   Array.from) as number[];
 *
 * @param list
 * @param predicate
 * @param collector
 * @returns
 */
export const Filter = <T, RType extends IterableType<T>>(
  list: IterableType<T>,
  predicate: Predicate<T>,
  collector?: (generator: Generator<T, void>) => RType
) => {
  const values = (function*() {
    for (const iterator of list) {
      if (predicate(iterator)) {
        yield iterator;
      }
    }
  })();
  return collector ? collector(values) as ReturnType<typeof collector> : values;
};
