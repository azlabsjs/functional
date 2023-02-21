/**
 * Reducer function type declaration
 */
export type ReducerType<TState, TAction> = (state: TState, action: TAction) => TState;

/**
 * @internal
 * Combine reducer function parameters type declaration
 */
type CombineReducersParameters<
  TSTate extends Record<string, unknown> = any,
  TAction = any
> =
  | Record<keyof TSTate, ReducerType<TSTate[keyof TSTate], TAction>>
  | [keyof TSTate, ReducerType<TSTate[keyof TSTate], TAction>][];

/**
 * Provices a reducer function that passes the state thruough 
 * a set of reducer functions that will update part of the state
 * using provided user key property.
 * 
 * @example
 * 
 * const state = {
 *      posts: [] as { title: string; content: string; id: number }[],
 *      post_types: []  as { label: string; id: number }[],
 * };
 * 
 * const reducer = combineReducers<typeof state>([
 *      [
 *          "posts",
 *          (state, action) => {
 *              switch(action.type) {
 *                  case "posts_add":
 *                      return [...state, action.payload];
 *                  default:
 *                      return [...state];
 *              }
 *          }
 *      ]
 * ]);
 * 
 * // Calling reducer on action
 * const _state = reducer(state, {type: "posts_add", payload: {...}});
 *
 * @param reducers
 */
export function combineReducers<
  TSTate extends Record<string, unknown> = any,
  TAction = any
>(reducers: CombineReducersParameters<TSTate, TAction>) {
  return Array.isArray(reducers)
    ? _combineListReducers(reducers)
    : _combineDictReducers(reducers);
}

/**
 * Create a reducer that update state based on list of (key, reducer) tuple
 * reducers passed as parameter
 *
 * @internal
 *
 * @param reducers
 */
function _combineDictReducers<
  TSTate extends Record<string, unknown> = any,
  TAction = any
>(reducers: Record<keyof TSTate, ReducerType<TSTate[keyof TSTate], TAction>>) {
  return (state: TSTate, action: TAction) => {
    let _state = { ...state } as TSTate;
    for (const key in reducers) {
      const reducer = reducers[key];
      const result = reducer(_state[key], action);
      if (_state === _state[key]) {
        continue;
      }
      _state = { ..._state, [key]: result };
    }
    return _state;
  };
}

/**
 * Create a reducer that update state based on dictionnary of
 * reducers passed as parameter
 *
 * @param reducers
 */
function _combineListReducers<
  TSTate extends Record<string, unknown> = any,
  TAction = any
>(reducers: [keyof TSTate, ReducerType<TSTate[keyof TSTate], TAction>][]) {
  return (state: TSTate, action: TAction) => {
    let _state = { ...state } as TSTate;
    for (const [key, reducer] of reducers) {
      const result = reducer(_state[key], action);
      if (_state === _state[key]) {
        continue;
      }
      _state = { ..._state, [key]: result };
    }
    return _state;
  };
}
