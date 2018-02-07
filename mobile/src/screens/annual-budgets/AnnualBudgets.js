import React, { PureComponent } from 'react';
import {
  StyleSheet,
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
} from 'actions/annual-budget-items';

// API
import { AllAnnualBudgetItemsRequest } from 'api/annual-budget-items';

// Components
import { FontAwesome } from '@expo/vector-icons';
import colors from 'utils/colors';
import DatePicker from 'utils/DatePicker';
import PlusButton from 'utils/PlusButton';
import Spin from 'utils/Spin';
import AnnualBudgetItemRow from './AnnualBudgetItemRow';

class AnnualBudgetsScreen extends PureComponent {
  static navigationOptions = ({ navigation, screenProps }) => {
    const showNewButton =
      screenProps.activeSidebarScreen !== 'NewAnnualBudgetItem';
    const { params = {} } = navigation.state;
    const annualBudgetId = params.annualBudgetId;
    const onPress = () => {
      screenProps.layoutNavigate('NewAnnualBudgetItem', {
        annualBudgetId,
      });
    };

    return {
      headerRight: <PlusButton disabled={!showNewButton} onPress={onPress} />,
    };
  };

  state = {
    loading: false,
    refreshing: false,
    year: new Date().getFullYear(),
    scrollEnabled: true,
  };

  componentDidMount() {
    setTimeout(() => {
      this.loadBudgetItems({ year: new Date().getFullYear() });
    }, 500);
  }

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

  renderItem = ({ item }) => {
    return (
      <AnnualBudgetItemRow
        budgetItem={item}
        screenProps={this.props.screenProps}
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
          scrollEnabled={this.state.scrollEnabled}
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
