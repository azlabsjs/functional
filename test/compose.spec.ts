import {
  compose,
  mapReduce,
  reverseCompose,
  vCompose,
  vReverseCompose,
} from '../src';

describe('Function composition tests', () => {
  it('should create a top -> down stack of functions', () => {
    const pipe = compose<number[], number>(
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

    expect(pipe([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        .map(x => x * 3)
        .filter(x => x % 2 === 0)
        .reduce((carr, curr) => {
          carr += curr;
          return carr;
        })
    );
  });

  it('should create a bottom -> up stack of functions and apply it to the provided value', () => {
    const pipe = reverseCompose<number[], number>(
      x => {
        return x;
      },
      (x: number[]) =>
        x.reduce((carr, curr) => {
          carr += curr;
          return carr;
        }),
      (x: number[]) => x.filter(x => x % 2 === 0),
      (x: number[]) => x.map(x => x * 3)
    );

    expect(pipe([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        .map(x => x * 3)
        .filter(x => x % 2 === 0)
        .reduce((carr, curr) => {
          carr += curr;
          return carr;
        })
    );
  });

  it('should transform each element of the list and reduce it down to a single value', () => {
    expect(
      mapReduce(
        (x: number) => x * 3,
        (carr: number, curr: number) => {
          carr += curr;
          return carr;
        },
        0
      )([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as number[])
    ).toEqual(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        .map(x => x * 3)
        .reduce((carr, curr) => {
          carr += curr;
          return carr;
        })
    );

    expect(
      mapReduce(
        (x: number) => x * 2,
        (carr, curr) => {
          carr += curr;
          return carr;
        },
        1
      )(10)
    ).toBe(21);
  });

  it('vReverseCompose() should return an array ["AZANDREW", "KOMI SIDOINE"] from "Azandrew, Komi Sidoine" input', () => {
    const pipe = vReverseCompose<string[]>(
      (name: string) => name?.split(', '),
      (name: string) => name?.toUpperCase(),
      (firstname: string, lastname: string) => `${firstname}, ${lastname}`
    );
    expect(pipe('Azandrew', 'Komi Sidoine')).toEqual([
      'AZANDREW',
      'KOMI SIDOINE',
    ]);
    expect(vReverseCompose()('Azandrew', 'Komi Sidoine')).toEqual([
      'Azandrew',
      'Komi Sidoine',
    ]);
  });

  it('vCompose() should return "AZANDREW, KOMI SIDOINE" from provided input', () => {
    const pipe = vCompose<string>(
      (firstname: string, lastname: string) => `${firstname}, ${lastname}`,
      (name: string) => name?.toUpperCase()
    );
    const result = pipe('Azandrew', 'Komi Sidoine');
    expect(result).toEqual('AZANDREW, KOMI SIDOINE');

    expect(vCompose()('Azandrew', 'Komi Sidoine')).toEqual([
      'Azandrew',
      'Komi Sidoine',
    ]);
  });
});
