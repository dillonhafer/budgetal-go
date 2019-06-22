import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';

// Utils
import Device from 'utils/Device';
const isTablet = Device.isTablet();
import { colors } from '@shared/theme';

class TabletNavigator extends PureComponent {
  state = {
    activeSidebarScreen: '',
  };

  renderSideItem = SideNavigator => {
    if (isTablet) {
      return (
        <View style={styles.sidebarContainer}>
          <SideNavigator
            ref={sidebar => {
              this.sidebar = sidebar;
            }}
            {...this.props}
            screenProps={{
              isTablet,
              activeSidebarScreen: this.state.activeSidebarScreen,
              layoutNavigate: this.layoutNavigate,
              goBack: this.goBack,
              parentNavigation: this.props.navigation,
            }}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  sidebarNavigate = (routeName, params = {}) => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName,
          params,
        }),
      ],
    });
    this.sidebar.dispatch(resetAction);
  };

  layoutNavigate = (routeName, params) => {
    if (isTablet) {
      this.setState({ activeSidebarScreen: routeName });
      this.sidebarNavigate(routeName, params);
    } else {
      this.main._navigation.navigate(routeName, params);
    }
  };

  goBack = (routeName = 'Main', params) => {
    if (isTablet) {
      this.setState({ activeSidebarScreen: routeName });
      this.sidebarNavigate(routeName, params);
    } else {
      this.main._navigation.goBack();
    }
  };

  render() {
    const { MainNavigator, SideNavigator } = this;
    return (
      <View style={styles.container}>
        {this.renderSideItem(SideNavigator)}
        <View style={styles.mainContainer}>
          <MainNavigator
            ref={main => {
              this.main = main;
            }}
            {...this.props}
            screenProps={{
              isTablet,
              activeSidebarScreen: this.state.activeSidebarScreen,
              layoutNavigate: this.layoutNavigate,
              goBack: this.goBack,
              parentNavigation: this.props.navigation,
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    ...(isTablet ? { flexDirection: 'row-reverse' } : {}),
  },
  mainContainer: {
    flex: 1,
    ...(isTablet ? { maxWidth: '38%' } : {}),
  },
  sidebarContainer: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 0.5,
    borderColor: 'transparent',
    borderLeftColor: colors.lines,
  },
});

export default TabletNavigator;
