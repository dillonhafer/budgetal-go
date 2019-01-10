import { toaster } from 'evergreen-ui';

const openNotificationWithIcon = (type, description, heading) => {
  setTimeout(_ => {
    toaster[type](heading, {
      description,
      width: '200px',
      right: '20px',
    });
  }, 0);
};

export const notice = description => {
  openNotificationWithIcon('success', description, 'Success');
};
export const error = description => {
  openNotificationWithIcon('danger', description, 'Error');
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
