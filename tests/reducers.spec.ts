import { combineReducers } from '../src';

type StateType = {
  posts: { title: string; content: string; id: number }[];
  post_types: { label: string; id: number }[];
};

const reducer = combineReducers<StateType>([
  [
    'posts',
    (state, action) => {
      if (!Array.isArray(action)) {
        return [...state];
      }
      switch (action[0]) {
        case 'posts_add':
          return [...state, action[1]];
        case 'posts_delete':
          return [...state].filter((state) => state.id !== action[1]);
        default:
          return [...state];
      }
    },
  ],
  [
    'post_types',
    (state, action) => {
      if (!Array.isArray(action)) {
        return [...state];
      }
      switch (action[0]) {
        case 'post_types_add':
          return [...state, action[1]];
        default:
          return [...state];
      }
    },
  ],
]);

describe('Test combineReducers implementation', () => {
  let state!: StateType;

  beforeEach(() => {
    state = {
      posts: [] as { title: string; content: string; id: number }[],
      post_types: [] as { label: string; id: number }[],
    };
  });

  it('should update state object when a new action is passed to the reducer function', () => {
    let _state = reducer(state, [
      'posts_add',
      {
        title: 'Lorem ipsum dolor sit amet',
        content:
          'consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
        id: 1,
      },
    ]);

    expect(_state.posts.length).toEqual(1);
    expect(_state.posts[0].title).toEqual('Lorem ipsum dolor sit amet');
  });

  it('should test that the updated state is modified copy of the original state', () => {
    let _state = reducer(state, [
        "posts_add", {
            title: "Lorem ipsum dolor sit amet",
            content:
                "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
            id: 1,
        }
    ]);
    _state = reducer(_state, [
        "posts_add",
        {
            title: "Lorem ipsum dolor sit amet",
            content:
                "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
            id: 2,
        }
    ]);

    expect(_state.posts.length).toEqual(2);
    expect(state.posts.length).toEqual(0);
    expect(state.posts).not.toEqual(_state.posts);
  });
});
