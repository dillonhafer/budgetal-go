import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  View,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import { budgetLoaded, updateBudgetCategory } from 'actions/budgets';

// API
import { BudgetRequest } from 'api/budgets';

// Components
import { Ionicons } from '@expo/vector-icons';

class BudgetsScreen extends Component {
  componentDidMount() {
    this.loadBudget();
  }

  loadBudget = async () => {
    this.setState({ loading: true });
    try {
      // const { month, year } = this.props.match.params;
      console.log('making request');
      const resp = await BudgetRequest({ month: 12, year: 2017 });

      if (resp && resp.ok) {
        this.props.budgetLoaded(resp);
      }
    } catch (err) {
      // console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {this.props.budgetCategories.map(budgetCategory => {
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

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({
    budgetLoaded: ({
      budget,
      budgetCategories,
      budgetItems,
      budgetItemExpenses,
    }) => {
      dispatch(
        budgetLoaded({
          budget,
          budgetCategories,
          budgetItems,
          budgetItemExpenses,
        }),
      );
    },
    changeCategory: budgetCategory => {
      dispatch(updateBudgetCategory({ budgetCategory }));
    },
  }),
)(BudgetsScreen);
