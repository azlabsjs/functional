import { Function_ } from './types';

/**
 * Function composition interface for creating a stack of functions that are apply to a given input.
 * Note: At each step, output from previous step is passed as input to the current step
 * 
 * @example
 *     const pipe = compose<number[], number>(
      (x: number[]) => x.map(x => x * 3),
      (x: number[]) => x.filter(x => x % 2 === 0),
      (x: number[]) =>
        x.reduce((carr, curr) => {
          carr += curr;
          return carr;
        }),
      x => {
        return x;
      }
    );
    // Usage
      pipe(
        Stream.iterate(1, x => x + 1)
          .take(10)
          .collect(ListCollector)
      );
 * 
 * @param funcs 
 * @returns 
 */
export function compose<T, R>(...funcs: Function_[]) {
  return function(source: T): R {
    let carry = source as unknown as  R;
    for (const func of funcs) {
      carry = func(carry);
    }
    return carry;
  };
}

/**
 * Create a stack same as {@see compose} but expect the entry function to
 * receive a list of parameters
 *
 * @example
 * const pipe = vCompose<string>(
 *  (firstname: string, lastname: string) => `${firstname}, ${lastname}`,
 *  (name: string) => name?.toUpperCase(),
 * );
 *
 * result = pipe('Azandrew', 'Komi Sidoine');
 *
 * @param funcs
 * @returns
 */
export function vCompose<R>(...funcs: Function_[]) {
  return function(...source: any[]): R {
    if (funcs.length === 0) {
      return source as unknown as R;
    }
    let carry = funcs[0](...source);
    for (const func of funcs.slice(1)) {
      carry = func(carry);
    }
    return carry;
  };
}

/**
 * Function composition interface for creating a stack of functions that get executed on a given input
 * Bottom -> Up
 * Note: At each step, output from previous step is passed as input to the current step
 *
 * @example
 * const pipe = reverseCompose<string, string[]>(
 *  (name: string) => name?.split(', '),
 *  (name: string) => name?.toUpperCase(),
 * );
 *
 * pipe('Azandrew, Komi Sidoine');
 *
 * @param funcs
 * @returns
 */
export function reverseCompose<T, R>(...funcs: Function_[]) {
  return function(source: T): R {
    let carry = source as unknown as R;
    for (const func of funcs.reverse()) {
      carry = func(carry);
    }
    return carry;
  };
}

/**
 * Function composition interface for creating a stack of functions that get executed on a given input
 * Bottom -> Up
 * Note: At each step, output from previous step is passed as input to the current step
 *
 * @example
 * const pipe = vReverseCompose<string[]>(
 *  (name: string) => name?.split(', '),
 *  (name: string) => name?.toUpperCase(),
 *  (firstname: string, lastname: string) => `${firstname}, ${lastname}`,
 * );
 *
 * pipe('Azandrew', 'Komi Sidoine');
 *
 * @param funcs
 * @returns
 */
export function vReverseCompose<R>(...funcs: Function_[]) {
  return function(...source: any[]): R {
    if (funcs.length === 0) {
      return source as unknown as R;
    }
    const stack = funcs.reverse();
    let carry = stack[0](...source);
    for (const func of stack.slice(1)) {
      carry = func(carry);
    }
    return carry;
  };
}
