import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  StatusBar,
  FlatList,
  View,
} from 'react-native';

// Components
import { Ionicons } from '@expo/vector-icons';
import { FindStatisticRequest } from 'api/statistics';
import { currencyf, categoryImage } from 'utils/helpers';

class StatisticsScreen extends Component {
  static navigationOptions = {
    title: 'Statistics',
    tabBarIcon: ({ tintColor }) => (
      <Ionicons name="md-stats" size={32} color={tintColor} />
    ),
  };

  state = {
    loading: false,
    budgetCategories: [],
  };

  componentDidMount() {
    this.loadStatistics();
  }

  renderCategory = ({ item: budgetCategory }) => {
    const percentSpent = 37;
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
            <Text style={styles.categoryName}>{budgetCategory.name}</Text>
            <Text style={styles.categoryName}>
              {currencyf(budgetCategory.amountSpent)} -{' '}
              {budgetCategory.percentSpent}%
            </Text>
          </View>
        </View>
      </View>
    );
  };

  loadStatistics = async () => {
    this.setState({ loading: true });
    try {
      const resp = await FindStatisticRequest({ month: 12, year: 2017 });
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
              parseFloat(cat.amountSpent) / totalSpent * 100,
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
      // error(err);
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

  render() {
    const { loading, budgetCategories } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <FlatList
          style={styles.list}
          refreshing={loading}
          onRefresh={this.loadStatistics}
          data={budgetCategories}
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
