import { NavigationActions } from 'react-navigation';

export const navigateHome = dispatch => {
  const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: 'App',
      }),
    ],
  });
  dispatch(resetAction);
};

export const navigateRoot = dispatch => {
  const resetAction = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Main' })],
  });
  dispatch(resetAction);
};
