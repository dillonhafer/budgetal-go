import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Image,
  StatusBar,
  FlatList,
  View,
  RefreshControl,
} from 'react-native';

// Components
import { error } from 'notify';
import { FindStatisticRequest } from 'api/statistics';
import { currencyf, categoryImage } from 'utils/helpers';
import DatePicker from 'utils/DatePicker';
import Spin from 'utils/Spin';
import { BlurViewInsetProps } from 'utils/navigation-helpers';
import { Bold } from 'components/Text';

class StatisticsScreen extends PureComponent {
  static navigationOptions = {
    title: 'Statistics',
  };

  state = {
    loading: false,
    refreshing: false,
    budget: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
    budgetCategories: [],
  };

  componentDidMount() {
    this.loadStatistics({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
  }

  renderCategory = ({ item: budgetCategory }) => {
    return (
      <View style={styles.categoryRow}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            style={styles.categoryImage}
            source={categoryImage(budgetCategory.name)}
          />
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Bold style={styles.categoryName}>{budgetCategory.name}</Bold>
            <Bold style={styles.categoryName}>
              {currencyf(budgetCategory.amountSpent)} -{' '}
              {budgetCategory.percentSpent}%
            </Bold>
          </View>
        </View>
      </View>
    );
  };

  loadStatistics = async ({ month, year }) => {
    this.setState({ loading: true });
    try {
      const resp = await FindStatisticRequest({ month, year });
      if (resp && resp.ok) {
        const totalSpent = resp.budgetCategories.reduce(
          (acc, cat) => acc + parseFloat(cat.amountSpent),
          0.0,
        );
        const budgetCategories = resp.budgetCategories.map(cat => {
          const name = cat.name;
          const amountSpent = parseFloat(cat.amountSpent);

          let percentSpent = 0;
          if (parseFloat(cat.amountSpent) > 0) {
            percentSpent = Math.round(
              (parseFloat(cat.amountSpent) / totalSpent) * 100,
            );
          }
          return {
            key: cat.name,
            name,
            amountSpent,
            percentSpent,
          };
        });
        this.setState({ budgetCategories });
      }
    } catch (err) {
      error('There was a problem downloading statistics');
    } finally {
      this.setState({ loading: false });
    }
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
      String(month) !== String(this.state.budget.month) ||
      String(year) !== String(this.state.budget.year)
    ) {
      this.setState({ budget: { month, year } });
      this.loadStatistics({ month, year });
    }
  };

  onRefresh = async () => {
    this.setState({ refreshing: true });
    try {
      const { year, month } = this.state.budget;
      await this.loadStatistics({ year, month });
    } catch (err) {
      error('There was a problem refreshing statistics');
    } finally {
      this.setState({ refreshing: false });
    }
  };

  renderHeader = () => {
    const { budget } = this.state;
    return (
      <DatePicker
        month={budget.month}
        year={budget.year}
        onChange={this.onDateChange}
      />
    );
  };

  render() {
    const { refreshing, loading, budgetCategories } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <FlatList
          {...BlurViewInsetProps}
          style={styles.list}
          refreshControl={
            <RefreshControl
              tintColor={'lightskyblue'}
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
          data={budgetCategories}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={this.renderCategory}
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
    backgroundColor: '#fff',
    padding: 15,
    justifyContent: 'center',
  },
  categoryName: {
    fontWeight: '700',
    color: '#444',
    fontSize: 18,
    marginBottom: 5,
  },
  categoryImage: {
    width: 64,
    height: 64,
    margin: 10,
  },
});

export default StatisticsScreen;
