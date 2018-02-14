import { Alert } from 'react-native';

export const error = msg => {
  global.alertWithType('error', 'Error', msg);
};

export const notice = msg => {
  global.alertWithType('success', 'Success', msg);
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
