import { Alert } from 'react-native';

export const error = msg => {
  Alert.alert(
    'Error',
    msg,
    [
      {
        text: 'OK',
      },
    ],
    { cancelable: false },
  );
};

export const notice = msg => {
  Alert.alert(
    'Success',
    msg,
    [
      {
        text: 'OK',
      },
    ],
    { cancelable: false },
  );
};
