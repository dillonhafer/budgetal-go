import React, { PureComponent } from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  StatusBar,
  View,
  RefreshControl,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import {
  loadBudget,
  refreshBudget,
  updateBudgetCategory,
} from 'actions/budgets';

// Components
import { categoryImage, reduceSum, percentSpent } from 'utils/helpers';
import Progress from 'utils/Progress';
import DatePicker from 'utils/DatePicker';
import Spin from 'utils/Spin';
import { BlurViewInsetProps } from 'utils/navigation-helpers';

import Card from 'components/Card';

class BudgetsScreen extends PureComponent {
  componentDidMount() {
    this.loadBudget({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
  }

  refresh = () => {
    this.props.refreshBudget(this.props.budget);
  };

  loadBudget = ({ month, year }) => {
    this.props.loadBudget({ month, year });
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

    return (
      <View style={styles.categoryRow}>
        <TouchableOpacity
          key={budgetCategory.id}
          disabled={isCurrent}
          activeOpacity={0.6}
          onPress={() => {
            this.props.changeCategory(budgetCategory);
            this.props.screenProps.layoutNavigate('BudgetCategory', {
              budgetCategory,
            });
          }}
        >
          <Card
            image={categoryImage(budgetCategory.name)}
            label={budgetCategory.name}
            color={'#fff'}
            light={true}
            budgeted={amountBudgeted}
            spent={amountSpent}
            remaining={remaining}
          >
            <Progress percent={percent} status={status} />
          </Card>
        </TouchableOpacity>
      </View>
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

  componentDidUpdate() {
    if (
      this.props.navigation.state &&
      this.props.navigation.state.params &&
      this.props.navigation.state.params.income !== this.props.budget.income
    ) {
      this.props.navigation.setParams({ income: this.props.budget.income });
    }
  }

  renderFooter = () => {
    const isCurrent =
      this.props.screenProps.isTablet &&
      this.props.currentBudgetCategory.name === 'import';

    let activeRowStyles = {};
    if (isCurrent) {
      activeRowStyles.backgroundColor = '#ddd';
    }

    return (
      <View>
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

  renderHeader = () => {
    const { budget } = this.props;

    const amountBudgeted = reduceSum(this.props.budgetItems);
    const amountSpent = reduceSum(this.props.budgetItemExpenses);
    const remaining = amountBudgeted - amountSpent;

    return (
      <React.Fragment>
        <DatePicker
          month={budget.month}
          year={budget.year}
          onChange={this.onDateChange}
        />
        <View>
          <View
            style={{
              height: 100,
              backgroundColor: '#fff',
              zIndex: 0,
            }}
          />
          <View style={{ zIndex: 1, backgroundColor: '#d8dce0' }}>
            <View style={{ marginTop: -90 }}>
              <Card
                label="Budgeted"
                budgeted={amountBudgeted}
                spent={amountSpent}
                remaining={remaining}
              />
            </View>
          </View>
        </View>
      </React.Fragment>
    );
  };

  render() {
    const { budgetLoading: loading, budgetRefreshing: refreshing } = this.props;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" animated={true} />
        <FlatList
          {...BlurViewInsetProps}
          refreshControl={
            <RefreshControl
              tintColor={'lightskyblue'}
              refreshing={refreshing}
              onRefresh={this.refresh}
            />
          }
          style={styles.list}
          keyExtractor={i => String(i.id)}
          data={this.props.budgetCategories}
          renderItem={this.renderCategory}
          ListFooterComponent={this.renderFooter}
          ListHeaderComponent={this.renderHeader}
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
    backgroundColor: '#d8dce0',
  },
  categoryImage: {
    width: 64,
    height: 64,
    margin: 10,
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
    loadBudget: ({ month, year }) => {
      dispatch(loadBudget({ month, year }));
    },
    refreshBudget: ({ month, year }) => {
      dispatch(refreshBudget({ month, year }));
    },
    changeCategory: budgetCategory => {
      dispatch(updateBudgetCategory({ budgetCategory }));
    },
  }),
)(BudgetsScreen);
