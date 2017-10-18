import notification from 'antd/lib/notification';

const openNotificationWithIcon = (type, description) => {
  notification[type]({
    message: type.charAt(0).toUpperCase() + type.slice(1),
    description,
  });
};

export const notice = description => {
  openNotificationWithIcon('success', description);
};
export const error = description => {
  openNotificationWithIcon('error', description);
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
