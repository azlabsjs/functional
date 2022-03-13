import {
  IdentityFunc,
  MapTo,
  Each,
  Tap,
  ReduceOne,
  Reduce,
  Filter,
} from '../src';

describe('Transformation, Filtering, Reducers function tests', () => {
  it('IdentityFunc should return the same value provided by the caller', () => {
    expect(IdentityFunc({ lat: 3.084853, long: 1.29852 })).toEqual({
      lat: 3.084853,
      long: 1.29852,
    });
  });

  it('MapTo() should return the double of the integer value provided', () => {
    expect(MapTo(3, x => x * 2)).toEqual(6);
  });

  it('Tap() should call the provided function with the provided value', () => {
    const mailSender = {
      sendMail: function(email: string) {
        if (email) {
          // Send email to remote user
        }
      },
    };
    const spy = jest.spyOn(mailSender, 'sendMail');
    Tap('azandrewdevelopper@example.com', mailSender.sendMail);
    expect(spy).toBeCalledWith('azandrewdevelopper@example.com');
  });

  it('Each() should call the provided function on all element of the list', () => {
    const mailSender = {
      sendMail: function(email: string) {
        if (email) {
          // Send email to remote user
        }
      },
    };
    const spy = jest.spyOn(mailSender, 'sendMail');
    Each(
      ['azandrewdevelopper@example.com', 'lordfera@example.com'],
      mailSender.sendMail
    );
    expect(spy).toBeCalledTimes(2);
  });

  it('ReduceOne() should return 3 if called on 1 with an initial value of 2', () => {
    expect(
      ReduceOne(
        1,
        (prev, curr) => {
          prev += curr;
          return prev;
        },
        2
      )
    ).toBe(3);
  });

  it('Reduce() should to produce same result as reduce() method called on array', () => {
    expect(
      Reduce(
        (function*() {
          let index = 1;
          while (index <= 10) {
            yield index;
            index++;
          }
        })(),
        (prev, curr) => {
          prev += curr;
          return prev;
        },
        0
      )
    ).toBe(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce((prev, curr) => {
        prev += curr;
        return prev;
      }, 0)
    );
  });

  it('Filter() should to produce same result as filter() method called on array', () => {
    expect(
      Filter(
        (function*() {
          let index = 1;
          while (index <= 10) {
            yield index;
            index++;
          }
        })(),
        x => x % 2 === 0,
        Array.from
      )
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(x => x % 2 === 0));
  });
});
