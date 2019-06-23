import { UPDATE_CURRENT_USER } from '@src/redux-constants/action-types';

export const updateCurrentUser = user => {
  return {
    type: UPDATE_CURRENT_USER,
    user,
  };
};
