import { notification } from 'antd';

const openNotificationWithIcon = (type, description) => {
  setTimeout(_ => {
    notification[type]({
      message: type.charAt(0).toUpperCase() + type.slice(1),
      description,
    });
  }, 0);
};

export const notice = description => {
  openNotificationWithIcon('success', description);
};
export const error = description => {
  openNotificationWithIcon('error', description);
};

export const colors = {
  primary: '#108ee9',
  disabled: '#cacaca',
  success: '#87d068',
  error: '#f50',
};

export const title = string => {
  let title = 'Budgetal';
  if (string.length) {
    title = `${string} | Budgetal`;
  }
  document.title = title;
};

export const scrollTop = () => {
  window.scrollTo(0, 0);
};
