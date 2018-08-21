import React, { PureComponent } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  StatusBar,
  View,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import {
  loadBudget,
  refreshBudget,
  updateBudgetCategory,
} from 'actions/budgets';

// Components
import DatePicker from 'utils/DatePicker';
import Spin from 'utils/Spin';

import Carousel from 'react-native-snap-carousel';
import Card, { FormCard, SplitBackground } from 'components/Card';

import housing from 'images/Housing.png';
import creditCards from 'images/Debts.png';

class NetWorthScreen extends PureComponent {
  state = {
    scrollWidth: 320,
  };

  componentDidMount() {
    this.loadNetWorthItems({ year: new Date().getFullYear() });
  }

  loadNetWorthItems = ({ year }) => {
    this.props.loadNetWorthItems({ year });
  };

  renderCategory = ({ item: month }) => {
    const isCurrent = true;
    // this.props.screenProps.isTablet &&
    // this.props.currentBudgetCategory.id > 0 &&
    // this.props.currentBudgetCategory.id === month.id;

    const { assets, liabilities } = month;

    return (
      <View>
        <TouchableOpacity
          key={month.label}
          disabled={isCurrent}
          activeOpacity={0.9}
          onPress={() => {}}
        >
          <Card
            marginHorizontal={0}
            label={`${month.label} 2018`}
            budgeted={assets - liabilities}
            spentLabel={'Liabilities'}
            spent={liabilities}
            remainingLabel={'Assets'}
            remaining={assets}
            decimal={0}
          />
        </TouchableOpacity>
      </View>
    );
  };

  onDateChange = ({ year }) => {
    if (String(year) !== String(this.props.year)) {
      this.loadNetWorthItems({ year });
    }
  };

  renderFooter = (text, image) => {
    const isCurrent =
      this.props.screenProps.isTablet &&
      this.props.currentBudgetCategory.name === 'import';

    let activeRowStyles = {};
    if (isCurrent) {
      activeRowStyles.backgroundColor = '#ddd';
    }

    return (
      <View>
        <TouchableOpacity
          disabled={isCurrent}
          activeOpacity={0.7}
          style={activeRowStyles}
          onPress={this.onImportPress}
        >
          <FormCard>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image style={styles.categoryImage} source={image} />
              <View
                style={{
                  flexDirection: 'column',
                  flex: 1,
                }}
              >
                <View>
                  <Text style={styles.importText}>{text}</Text>
                </View>
              </View>
            </View>
          </FormCard>
        </TouchableOpacity>
      </View>
    );
  };

  onImportPress = () => {
    this.props.changeCategory({ id: -1, name: 'import' });
    this.props.screenProps.layoutNavigate('ImportExpenses');
  };

  render() {
    const { budget, budgetLoading: loading } = this.props;

    return (
      <ScrollView
        scrollEnabled={false}
        style={styles.container}
        onLayout={event => {
          const { width } = event.nativeEvent.layout;
          this.setState({ scrollWidth: width });
        }}
      >
        <StatusBar barStyle="dark-content" animated={true} />
        <View style={{ backgroundColor: '#fff', paddingHorizontal: 5 }}>
          <DatePicker year={budget.year} onChange={this.onDateChange} />
        </View>
        <SplitBackground>
          <Carousel
            ref={c => {
              this._carousel = c;
            }}
            data={this.props.netWorth.months}
            renderItem={this.renderCategory}
            sliderWidth={this.state.scrollWidth}
            inactiveSlideOpacity={1}
            inactiveSlideScale={0.9}
            itemWidth={this.state.scrollWidth - 50}
            firstItem={new Date().getMonth()}
          />
        </SplitBackground>
        <View style={{ marginHorizontal: 5 }}>
          {this.renderFooter('Manage Assets', housing)}
          {this.renderFooter('Manage Liabilities', creditCards)}
        </View>
        <Spin spinning={loading} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d8dce0',
  },
  categoryImage: {
    width: 64,
    height: 64,
    margin: 5,
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
    netWorth: {
      year: 2018,
      months: [
        { label: 'Janurary', assets: 5000000, liabilities: 487888 },
        { label: 'Feburary', assets: 5001000, liabilities: 485888 },
        { label: 'March', assets: 5002000, liabilities: 483888 },
        { label: 'April', assets: 5002000, liabilities: 483888 },
        { label: 'May', assets: 5002000, liabilities: 483888 },
        { label: 'June', assets: 5002000, liabilities: 483888 },
        { label: 'July', assets: 5002000, liabilities: 483888 },
        { label: 'August', assets: 5002000, liabilities: 483888 },
        { label: 'September', assets: 5002000, liabilities: 483888 },
        { label: 'October', assets: 5002000, liabilities: 483888 },
        { label: 'November', assets: 5002000, liabilities: 483888 },
        { label: 'December', assets: 5002000, liabilities: 483888 },
      ],
    },
  }),
  dispatch => ({
    loadNetWorthItems: ({ year }) => {
      dispatch(loadBudget({ month: 1, year }));
    },
    refreshBudget: ({ month, year }) => {
      dispatch(refreshBudget({ month, year }));
    },
    changeCategory: budgetCategory => {
      dispatch(updateBudgetCategory({ budgetCategory }));
    },
  }),
)(NetWorthScreen);
