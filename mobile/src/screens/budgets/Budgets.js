import React, { PureComponent } from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  Text,
  Image,
  FlatList,
  StatusBar,
  View,
  RefreshControl,
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
import EditIncomeModal from 'screens/budgets/EditIncomeModal';
import Spin from 'utils/Spin';

import { GetCurrentUser } from 'utils/authentication';
class BudgetsScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    headerRight: <EditIncomeModal />,
  });

  state = {
    admin: false, // Feature Flag
    loading: false,
    refreshing: false,
  };

  componentDidMount() {
    this.loadBudget({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
    // Feature Flag
    GetCurrentUser().then(user => this.setState({ admin: user.admin }));
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

    const isCurrent =
      this.props.screenProps.isTablet &&
      this.props.currentBudgetCategory.id > 0 &&
      this.props.currentBudgetCategory.id === budgetCategory.id;
    let activeRowStyles = {};
    if (isCurrent) {
      activeRowStyles = {
        backgroundColor: '#ddd',
      };
    }

    return (
      <TouchableHighlight
        underlayColor={'#DDD'}
        disabled={isCurrent}
        style={[styles.categoryRow, activeRowStyles]}
        key={budgetCategory.id}
        onPress={() => {
          this.props.changeCategory(budgetCategory);
          this.props.screenProps.layoutNavigate('BudgetCategory', {
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
      </TouchableHighlight>
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
      this.props.screenProps.goBack();
      this.props.changeCategory({ id: -1 });
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

  renderFooter = () => {
    // Feature Flag
    if (!this.state.admin) {
      return null;
    }

    const isCurrent =
      this.props.screenProps.isTablet &&
      this.props.currentBudgetCategory.name === 'import';

    let activeRowStyles = {};
    if (isCurrent) {
      activeRowStyles.backgroundColor = '#ddd';
    }

    return (
      <View>
        {this.renderSeparator()}
        <TouchableHighlight
          underlayColor={'#DDD'}
          disabled={isCurrent}
          style={[styles.categoryRow, activeRowStyles]}
          key={`footer`}
          onPress={this.onImportPress}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={styles.categoryImage}
              source={require('images/csv.png')}
            />
            <View
              style={{
                flexDirection: 'column',
                flex: 1,
              }}
            >
              <View>
                <Text style={styles.importText}>Import Expenses</Text>
                <Text style={styles.importText}>From CSV</Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  onImportPress = () => {
    this.props.changeCategory({ id: -1, name: 'import' });
    this.props.screenProps.layoutNavigate('ImportExpenses');
  };

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
          refreshControl={
            <RefreshControl
              tintColor={'lightskyblue'}
              refreshing={refreshing}
              onRefresh={this.refresh}
            />
          }
          style={styles.list}
          keyExtractor={i => i.id}
          data={this.props.budgetCategories}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={this.renderCategory}
          ListFooterComponent={this.renderFooter}
        />
        <Spin spinning={loading && !refreshing} />
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
  importText: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#444',
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
