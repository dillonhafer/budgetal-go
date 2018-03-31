import React from 'react';
import { Platform, View } from 'react-native';
import { BlurView } from 'expo';

export const NavigationHeight = 44;
export const SidebarNavigationHeight = 43.5;

export const BlurViewInsetProps = {
  contentInset: { top: NavigationHeight },
  contentOffset: { y: -NavigationHeight },
  contentInsetAdjustmentBehavior: 'automatic',
};

export const BlurViewNavigationOptions = {
  headerTransparent: true,
  headerBackground: Platform.select({
    ios: <BlurView style={{ flex: 1 }} intensity={98} />,
    android: (
      <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.7)' }} />
    ),
  }),
};
