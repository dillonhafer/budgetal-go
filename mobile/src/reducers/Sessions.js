import { TOGGLE_DELETE } from 'redux-constants/action-types';

export default function sessionState(state = { showDelete: false }, action) {
  switch (action.type) {
    case TOGGLE_DELETE:
      return {
        ...state,
        showDelete: !state.showDelete,
      };
    default:
      return state;
  }
}
