import React, { PureComponent } from 'react';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  FlatList,
  View,
  RefreshControl,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import {
  itemsFetched,
  updatedSelectedItem,
  hideForm,
  removeItem,
} from 'actions/annual-budget-items';

// API
import {
  AllAnnualBudgetItemsRequest,
  DeleteAnnualBudgetItemRequest,
} from 'api/annual-budget-items';

// Components
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import colors from 'utils/colors';
import { currencyf } from 'utils/helpers';
import { round } from 'lodash';
import DatePicker from 'utils/DatePicker';
import { notice, confirm } from 'notify';
import PlusButton from 'utils/PlusButton';
import Spin from 'utils/Spin';

const B = ({ style, children }) => {
  return <Text style={[{ fontWeight: '800' }, style]}>{children}</Text>;
};

class AnnualBudgetsScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const annualBudgetId = params.annualBudgetId;
    const onPress = () => {
      navigation.navigate('NewAnnualBudgetItem', {
        annualBudgetId,
      });
    };
    return {
      headerRight: <PlusButton onPress={onPress} />,
    };
  };

  state = {
    loading: false,
    refreshing: false,
    year: new Date().getFullYear(),
  };

  componentDidMount() {
    this.loadBudgetItems({ year: new Date().getFullYear() });
  }

  deleteItem = async item => {
    const resp = await DeleteAnnualBudgetItemRequest(item.id);
    if (resp && resp.ok) {
      this.props.removeItem(item);
      notice(`${item.name} Deleted`);
    }
  };

  confirmDelete = item => {
    confirm({
      title: `Delete ${item.name}?`,
      okText: 'Delete',
      onOk: () => this.deleteItem(item),
    });
  };

  itemActions = item => {
    Alert.alert(
      item.name,
      '',
      [
        {
          text: 'Edit',
          onPress: () =>
            this.props.navigation.navigate('EditAnnualBudgetItem', {
              annualBudgetItem: item,
            }),
        },
        {
          text: 'Progress',
          onPress: () => {
            this.navProgress(item);
          },
        },
        {
          text: 'Delete',
          onPress: () => this.confirmDelete(item),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          onPress: _ => {},
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };

  navProgress = budgetItem => {
    this.props.navigation.navigate('AnnualBudgetProgress', {
      budgetItem,
    });
  };

  loadBudgetItems = async ({ year }) => {
    this.setState({ loading: true });
    try {
      const resp = await AllAnnualBudgetItemsRequest(year);

      if (resp && resp.ok) {
        this.props.navigation.setParams({
          year,
          annualBudgetId: resp.annualBudgetId,
        });
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
          this.itemActions(budgetItem);
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

  onRefresh = async () => {
    this.setState({ refreshing: true });
    try {
      await this.loadBudgetItems({ year: this.state.year });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ refreshing: false });
    }
  };

  onDateChange = ({ year }) => {
    this.loadBudgetItems({ year });
    this.setState({ year });
  };

  render() {
    const { loading, refreshing } = this.state;
    const { annualBudgetItems } = this.props;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <DatePicker year={this.state.year} onChange={this.onDateChange} />
        <FlatList
          ListHeaderComponent={() => {
            return this.renderHeader(annualBudgetItems.length);
          }}
          refreshControl={
            <RefreshControl
              tintColor={'lightskyblue'}
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
          style={styles.list}
          keyExtractor={i => i.id}
          data={annualBudgetItems}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={this.renderItem}
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
    removeItem: item => {
      dispatch(removeItem(item));
    },
  }),
)(AnnualBudgetsScreen);
