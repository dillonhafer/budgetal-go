import SignInScreen from './SignIn';
import { connect } from 'react-redux';
import { updateCurrentUser } from '@src/actions/users';

export default connect(
  null,
  dispatch => ({
    updateCurrentUser: user => {
      dispatch(updateCurrentUser(user));
    },
  }),
)(SignInScreen);
