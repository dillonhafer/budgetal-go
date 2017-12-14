import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  StatusBar,
  View,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import { budgetLoaded, updateBudgetCategory } from 'actions/budgets';

// API
import { BudgetRequest } from 'api/budgets';

// Components
import { Feather } from '@expo/vector-icons';
import {
  categoryImage,
  currencyf,
  reduceSum,
  percentSpent,
} from 'utils/helpers';
import Progress from 'utils/Progress';
import ProgressLabel from 'utils/ProgressLabel';
import DatePicker from 'utils/DatePicker';
import EditIncomeModal from 'screens/EditIncomeModal';

class BudgetsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: <EditIncomeModal />,
  });

  state = {
    loading: false,
    refreshing: false,
  };

  componentDidMount() {
    this.loadBudget({ month: 12, year: 2017 });
  }

  refresh = async () => {
    this.setState({ refreshing: true });
    try {
      const { year, month } = this.props.budget;
      await this.loadBudget({ year, month });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ refreshing: false });
    }
  };

  loadBudget = async ({ month, year }) => {
    this.setState({ loading: true });
    try {
      const resp = await BudgetRequest({ month, year });
      if (resp && resp.ok) {
        this.props.navigation.setParams({
          month,
          year,
          income: resp.budget.income,
        });
        this.props.budgetLoaded(resp);
      }
    } catch (err) {
      // console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  renderCategory = ({ item: budgetCategory }) => {
    const items = this.props.budgetItems.filter(
      i => i.budgetCategoryId === budgetCategory.id,
    );
    const itemIds = items.map(i => {
      return i.id;
    });
    const expenses = this.props.budgetItemExpenses.filter(e => {
      return itemIds.includes(e.budgetItemId);
    });

    const amountSpent = reduceSum(expenses);
    const amountBudgeted = reduceSum(items);
    const remaining = amountBudgeted - amountSpent;
    const percent = percentSpent(amountBudgeted, amountSpent);
    let status = 'normal';
    if (remaining < 0) {
      status = 'exception';
    } else if (remaining === 0.0) {
      status = 'success';
    }

    return (
      <TouchableOpacity
        style={styles.categoryRow}
        key={budgetCategory.id}
        onPress={() => {
          this.props.navigation.navigate('BudgetCategory', {
            budgetCategory,
          });
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Image
            style={styles.categoryImage}
            source={categoryImage(budgetCategory.name)}
          />
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <Text style={styles.categoryName}>{budgetCategory.name}</Text>
            <ProgressLabel spent={amountSpent} remaining={remaining} />
            <Progress percent={percent} status={status} />
          </View>
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

  onDateChange = ({ month, year }) => {
    if (
      String(month) !== String(this.props.budget.month) ||
      String(year) !== String(this.props.budget.year)
    ) {
      this.loadBudget({ month, year });
    }
  };

  componentWillReceiveProps(next) {
    if (
      this.props.navigation.state &&
      this.props.navigation.state.params &&
      this.props.navigation.state.params.income !== next.budget.income
    ) {
      this.props.navigation.setParams({ income: next.budget.income });
    }
  }

  render() {
    const { budget } = this.props;
    const { loading, refreshing } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" animated={true} />
        <DatePicker
          month={budget.month}
          year={budget.year}
          onChange={this.onDateChange}
        />
        <FlatList
          style={styles.list}
          refreshing={refreshing}
          onRefresh={this.refresh}
          keyExtractor={i => i.id}
          data={this.props.budgetCategories}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={this.renderCategory}
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
  categoryRow: {
    backgroundColor: '#fff',
    padding: 15,
    justifyContent: 'center',
  },
  categoryImage: {
    width: 64,
    height: 64,
    margin: 10,
  },
  categoryName: {
    fontWeight: '700',
    color: '#444',
    fontSize: 18,
    marginBottom: 5,
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
