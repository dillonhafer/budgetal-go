import { toaster } from 'evergreen-ui';

const openNotificationWithIcon = (type, description, heading, options = {}) => {
  setTimeout(_ => {
    toaster[type](heading, {
      ...options,
      description,
      width: '200px',
      right: '20px',
    });
  }, 0);
};

export const notice = (description, options = {}) => {
  openNotificationWithIcon('success', description, 'Success', options);
};
export const error = (description, options = {}) => {
  openNotificationWithIcon('danger', description, 'Error', options);
};

export const title = string => {
  let title = 'Budgetal';
  if (string.length) {
    title = `${string} | Budgetal`;
  }
  document.title = title;
};

export const scrollTop = () => {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
};
