import React, { PureComponent } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BudgetalText } from 'components/Text';

class DrawerItem extends PureComponent {
  render() {
    const { iconName, label, onPress } = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={iconName}
              size={22}
              color={'#fff'}
              style={{
                alignItems: 'center',
                width: 22,
                margin: 10,
                marginLeft: 20,
              }}
            />
          </View>
          <View style={styles.textContainer}>
            <BudgetalText style={styles.labelText}>{label}</BudgetalText>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    opacity: 0.62,
    width: 24,
    marginHorizontal: 16,
  },
  labelText: {
    color: '#fff',
  },
});

export default DrawerItem;
