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
import { importedBudgetItems, updateBudgetCategory } from 'actions/budgets';

// API
import { ImportCategoryRequest } from 'api/budgets';

// Components
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import colors from 'utils/colors';
import { notice, confirm } from 'notify';
import Progress from 'utils/Progress';
import ProgressLabel from 'utils/ProgressLabel';
import { reduceSum, percentSpent } from 'utils/helpers';
import { PrimaryButton } from 'forms';

const NewItemButton = connect(
  state => ({}),
  dispatch => ({}),
)(({ budgetItem }) => {
  const onPress = _ => {};

  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons
        name="ios-add-outline"
        size={32}
        color={'#037aff'}
        style={{
          fontWeight: '300',
          paddingRight: 20,
          paddingLeft: 20,
        }}
      />
    </TouchableOpacity>
  );
});

class BudgetCategoryScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <NewItemButton budgetCategory={navigation.state.params.budgetCategory} />
    ),
  });

  importPreviousItems = async () => {
    const budgetCategory = this.props.navigation.state.params.budgetCategory;
    const resp = await ImportCategoryRequest(budgetCategory.id);
    if (resp && resp.ok) {
      this.props.importedBudgetItems(resp.budgetItems);
      notice(resp.message);
    }
  };

  onImportPress = () => {
    const budgetCategory = this.props.navigation.state.params.budgetCategory;
    confirm({
      okText: `Import ${budgetCategory.name}`,
      cancelText: 'Cancel',
      title: 'Import Budget Items',
      content: `Do you want to import budget items from your previous month's ${budgetCategory.name} category?`,
      onOk: this.importPreviousItems,
      onCancel() {},
    });
  };

  renderItem = ({ item: budgetItem }) => {
    const expenses = this.props.budgetItemExpenses.filter(e => {
      return budgetItem.id === e.budgetItemId;
    });

    const amountSpent = reduceSum(expenses);
    const amountBudgeted = budgetItem.amount;
    const remaining = amountBudgeted - amountSpent;
    const percentage = percentSpent(amountBudgeted, amountSpent);
    let status = 'normal';
    if (remaining < 0) {
      status = 'exception';
    } else if (remaining === 0.0) {
      status = 'success';
    }

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
        <View>
          <Text style={styles.itemName}>{budgetItem.name}</Text>
          <ProgressLabel spent={amountSpent} remaining={remaining} />
          <Progress percent={percentage} status={status} />
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

  renderHeader = length => {
    if (!!length) {
      return null;
    }
    return (
      <View style={{ padding: 20, paddingTop: 40, alignItems: 'center' }}>
        <FontAwesome name="money" size={32} color={colors.success} />
        <Text style={{ margin: 5, textAlign: 'center', fontWeight: 'bold' }}>
          There aren't any buget items yet
        </Text>
      </View>
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
          ListHeaderComponent={() => {
            return this.renderHeader(items.length);
          }}
          style={styles.list}
          keyExtractor={i => i.id}
          data={items}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={this.renderItem}
          ListFooterComponent={
            <PrimaryButton title="Import" onPress={this.onImportPress} />
          }
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
  },
});

export default connect(
  state => ({
    ...state.budget,
  }),
  dispatch => ({
    importedBudgetItems: budgetItems => {
      dispatch(importedBudgetItems(budgetItems));
    },
  }),
)(BudgetCategoryScreen);
