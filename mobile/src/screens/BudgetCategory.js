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
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import colors from 'utils/colors';
import { notice, confirm } from 'notify';
import Progress from 'utils/Progress';
import ProgressLabel from 'utils/ProgressLabel';
import { reduceSum, percentSpent } from 'utils/helpers';

const RightImportButton = connect(
  state => ({}),
  dispatch => ({
    _importedBudgetItems: budgetItems => {
      dispatch(importedBudgetItems(budgetItems));
    },
  }),
)(({ budgetCategory, _importedBudgetItems }) => {
  const importPreviousItems = async () => {
    const resp = await ImportCategoryRequest(budgetCategory.id);
    if (resp && resp.ok) {
      _importedBudgetItems(resp.budgetItems);
      notice(resp.message);
    }
  };

  const onPress = _ => {
    confirm({
      okText: `Import ${budgetCategory.name}`,
      cancelText: 'Cancel',
      title: 'Import Budget Items',
      content: `Do you want to import budget items from your previous month's ${budgetCategory.name} category?`,
      onOk: importPreviousItems,
      onCancel() {},
    });
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <MaterialCommunityIcons
        name="content-copy"
        size={24}
        color={'#037aff'}
        style={{
          fontWeight: '300',
          paddingRight: 15,
        }}
      />
    </TouchableOpacity>
  );
});

class BudgetCategoryScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <RightImportButton
        budgetCategory={navigation.state.params.budgetCategory}
      />
    ),
  });

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
  dispatch => ({}),
)(BudgetCategoryScreen);
