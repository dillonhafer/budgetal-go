import SignInScreen from './SignIn';
import { connect } from 'react-redux';
import { updateCurrentUser } from 'actions/users';

export default connect(
  null,
  dispatch => ({
    updateCurrentUser: user => {
      dispatch(updateCurrentUser(user));
    },
  }),
)(SignInScreen);
