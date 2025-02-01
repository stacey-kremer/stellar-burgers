import { expect, test } from '@jest/globals';
import store from './store';

describe('rootReducer test', () => {
  test('init state test', () => {
    const testAction = { type: 'UNKNOWN_ACTION' };
    const initialState = store.getState();
    expect(initialState).toEqual(store.getState());
  });
});
