import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  View,
} from 'react-native';

// Components
import { Ionicons } from '@expo/vector-icons';

class BudgetCategoryScreen extends Component {
  static navigationOptions = {
    title: 'Charity',
    tabBarIcon: ({ tintColor }) => (
      <Ionicons name="md-calculator" size={32} color={tintColor} />
    ),
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Text
          style={{
            fontSize: 22,
            fontWeight: '900',
            color: '#444',
            marginTop: 20,
          }}
        >
          ---
        </Text>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('BudgetItem', {
              budgetItem: { name: 'Gifts' },
            });
          }}
        >
          <Text>Gifts</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
    alignItems: 'center',
    flexDirection: 'column',
  },
});

export default BudgetCategoryScreen;
