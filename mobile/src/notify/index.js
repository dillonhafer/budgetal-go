import { Alert } from "react-native";

export const error = (msg, delay) => {
  global.alertWithType("error", "Error", msg, { delay });
};

export const notice = (msg, delay) => {
  global.alertWithType("success", "Success", msg, { delay });
};

export const confirm = ({
  okText,
  cancelText,
  title,
  content,
  onOk,
  onCancel,
}: {
  okText: string,
  title: string,
  onOk(): void,
}) => {
  Alert.alert(
    title || "Confirm",
    content || "Are you sure?",
    [
      {
        text: cancelText || "Cancel",
        style: "cancel",
        onPress: onCancel,
      },
      {
        text: okText || "OK",
        style: "destructive",
        onPress: onOk,
      },
    ],
    { cancelable: true }
  );
};
