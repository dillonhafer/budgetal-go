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

export const confirm = ({
  okText,
  cancelText,
  title,
  content,
  onOk,
  onCancel,
}) => {
  Alert.alert(
    title || 'Confirm',
    content || 'Are you sure?',
    [
      {
        text: cancelText || 'Cancel',
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: okText || 'OK',
        style: 'destructive',
        onPress: onOk,
      },
    ],
    { cancelable: true },
  );
};
