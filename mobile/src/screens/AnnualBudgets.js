import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  FlatList,
  View,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import {
  itemsFetched,
  updatedSelectedItem,
  hideForm,
} from 'actions/annual-budget-items';

// API
import { AllAnnualBudgetItemsRequest } from 'api/annual-budget-items';

// Components
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import colors from 'utils/colors';
import { currencyf } from 'utils/helpers';
import { round } from 'lodash';

const B = ({ style, children }) => {
  return <Text style={[{ fontWeight: '800' }, style]}>{children}</Text>;
};

class AnnualBudgetsScreen extends Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    this.loadBudgetItems();
  }

  loadBudgetItems = async () => {
    this.setState({ loading: true });
    try {
      const year =
        (this.props.navigation.state.params &&
          this.props.navigation.state.params.year) ||
        new Date().getFullYear();

      const resp = await AllAnnualBudgetItemsRequest(year);

      if (resp && resp.ok) {
        this.props.itemsFetched(resp.annualBudgetId, resp.annualBudgetItems);
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  renderItem = ({ item: budgetItem }) => {
    const month = currencyf(round(budgetItem.amount / budgetItem.interval));
    const color = budgetItem.paid ? colors.success : colors.disabled;

    return (
      <TouchableOpacity
        style={styles.itemRow}
        key={budgetItem.id}
        onPress={() => {
          // this.props.navigation.navigate('BudgetItem', {
          // budgetItem,
          // });
        }}
      >
        <View>
          <Text style={styles.itemName}>{budgetItem.name}</Text>
          <Text style={{ textAlign: 'center' }}>
            In order to reach <B>{currencyf(budgetItem.amount)}</B>
          </Text>
          <Text style={{ textAlign: 'center' }}>
            by <B>{moment(budgetItem.dueDate).format('LL')}</B>
          </Text>
          <Text style={{ textAlign: 'center' }}>you need to save</Text>
          <B style={{ textAlign: 'center' }}>{month}/month</B>
        </View>
        <View style={[styles.tag, { backgroundColor: color }]}>
          <Text style={styles.tagText}>Paid</Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderHeader = length => {
    if (!!length) {
      return null;
    }
    return (
      <View style={{ padding: 20, paddingTop: 40, alignItems: 'center' }}>
        <FontAwesome name="money" size={32} color={colors.success} />
        <Text style={{ margin: 5, textAlign: 'center', fontWeight: 'bold' }}>
          There aren't any items yet
        </Text>
      </View>
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
    const { annualBudgetItems } = this.props;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <FlatList
          ListHeaderComponent={() => {
            return this.renderHeader(annualBudgetItems.length);
          }}
          refreshing={this.state.loading}
          onRefresh={this.loadBudgetItems}
          style={styles.list}
          keyExtractor={i => i.id}
          data={annualBudgetItems}
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
  itemName: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 10,
  },
  tag: {
    alignSelf: 'center',
    padding: 5,
    borderRadius: 5,
    width: 50,
  },
  tagText: {
    textAlign: 'center',
    color: '#fff',
  },
});

export default connect(
  state => ({
    ...state.annualBudgetId,
    ...state.annualBudgetItems,
  }),
  dispatch => ({
    itemsFetched: (annualBudgetId, annualBudgetItems) => {
      dispatch(itemsFetched(annualBudgetId, annualBudgetItems));
    },
  }),
)(AnnualBudgetsScreen);
