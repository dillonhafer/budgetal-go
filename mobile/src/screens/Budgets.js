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

class BudgetsScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {[
          { name: 'Charity' },
          { name: 'Saving' },
          { name: 'Housing' },
          { name: 'Utilities' },
          { name: 'Food' },
          { name: 'Clothing' },
          { name: 'Transportation' },
          { name: 'Medical/Health' },
          { name: 'Insurance' },
          { name: 'Personal' },
          { name: 'Recreation' },
          { name: 'Debts' },
        ].map(budgetCategory => {
          return (
            <TouchableOpacity
              style={{ backgroundColor: '#fff', padding: 10, margin: 4 }}
              key={budgetCategory.name}
              onPress={() => {
                this.props.navigation.navigate('BudgetCategory', {
                  budgetCategory,
                });
              }}
            >
              <Text>{budgetCategory.name}</Text>
            </TouchableOpacity>
          );
        })}
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

export default BudgetsScreen;
