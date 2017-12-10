import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  View,
  FlatList,
} from 'react-native';

// Redux
import { connect } from 'react-redux';

// Components
import { Ionicons } from '@expo/vector-icons';

class BudgetCategoryScreen extends Component {
  renderItem = ({ item: budgetItem }) => {
    const expenses = this.props.budgetItemExpenses.filter(e => {
      return budgetItem.id === e.budgetItemId;
    });

    return (
      <TouchableOpacity
        style={styles.itemRow}
        key={budgetItem.id}
        onPress={() => {
          this.props.navigation.navigate('BudgetItem', {
            budgetItem,
          });
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Text>{budgetItem.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
        }}
      />
    );
  };

  render() {
    const category = this.props.navigation.state.params.budgetCategory;
    const items = this.props.budgetItems.filter(
      i => i.budgetCategoryId === category.id,
    );
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <FlatList
          style={styles.list}
          keyExtractor={i => i.id}
          data={items}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'column',
  },
  list: {
    alignSelf: 'stretch',
  },
  itemRow: {
    backgroundColor: '#fff',
    padding: 15,
    justifyContent: 'center',
  },
});

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({}),
)(BudgetCategoryScreen);
