import { Compator, memoize } from '../src';

function isobject_(o: unknown) {
    return o != null && typeof o === 'object';
  }

export const shallowEqual: Compator = (a: unknown, b: unknown) => {
    if (a === b) {
      return true;
    }
    if (isobject_(a) && isobject_(b)) {
      const _a = a as any;
      const _b = b as any;
      if (
        (Array.isArray(_a) && !Array.isArray(_b)) ||
        (Array.isArray(_a) && !Array.isArray(_b))
      ) {
        return false;
      }
      const aKeys = Object.keys(_a);
      if (aKeys.length !== Object.keys(_b).length) {
        return false;
      }
      for (const key of aKeys) {
        if (_a[key] !== _b[key]) {
          return false;
        }
      }
      return true;
    }
    return Object.is(a, b);
  };

describe('Memoization tests', () => {
  it('Should called memoize function only if arguments changes', () => {
    const costFunc = (() => {
      let numCalls = 0;
      return {
        compute: (params: { [index: number]: number }, initial: number = 0) => {
          // Performs heavy computation
          numCalls++;
          return (
            Array.from(Object.keys(params)).map((value) => +value) ?? []
          ).reduce((carry, curr) => {
            carry += curr;
            return carry;
          }, initial ?? 0);
        },
        toBeCalled: (times: number) => {
          return times === numCalls;
        },
      };
    })();

    const func = memoize(costFunc.compute, {
      equality: {
        func: shallowEqual,
      },
      //   hash: true,
    });
    // Call the memoized function twice with empty
    func([]);
    func([]);
    expect(costFunc.toBeCalled(1)).toEqual(true);

    // Call the memoized twice function with non parameters
    func([1, 2, 3, 4, 5, 6]);
    func([1, 2, 3, 4, 5, 6]);
    expect(costFunc.toBeCalled(2)).toBe(true);
  });
});
