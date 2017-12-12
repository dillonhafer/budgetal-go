import { UPDATE_CURRENT_USER } from 'redux-constants/action-types';

export default function usersState(
  state = { firstName: '', lastName: '', email: '', avatarUrl: '' },
  action,
) {
  switch (action.type) {
    case UPDATE_CURRENT_USER:
      return {
        ...state,
        ...action.user,
      };
    default:
      return state;
  }
}
