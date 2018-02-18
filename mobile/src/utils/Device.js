import { Dimensions, Platform } from 'react-native';
import { Constants } from 'expo';

const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

const isLandscape = () => {
  const dim = Dimensions.get('screen');
  return dim.width >= dim.height;
};

const isTablet = () => {
  if (Platform.OS === 'ios') {
    return Constants.platform.ios.userInterfaceIdiom === 'tablet';
  }
};

const isPhone = () => {
  return !isTablet();
};

export default {
  isPortrait,
  isLandscape,
  isTablet,
  isPhone,
};
