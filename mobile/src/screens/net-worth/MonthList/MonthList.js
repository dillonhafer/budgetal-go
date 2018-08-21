import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Card, { SplitBackground } from 'components/Card';
import { reduceSum } from 'utils/helpers';
import colors from 'utils/colors';
import GroupList from 'components/GroupList';
import { PrimaryButton } from 'forms';

class MonthList extends Component {
  renderHeader = () => {
    const { month, year } = this.props.navigation.state.params;
    const totalAssets = reduceSum(month.assets);
    const totalLiabilities = reduceSum(month.liabilities);
    const netWorth = totalAssets - totalLiabilities;

    return (
      <SplitBackground>
        <Card
          label={`${month.label} ${year}`}
          budgeted={netWorth}
          spent={totalLiabilities}
          spentLabel={'Liabilities'}
          remainingLabel={'Assets'}
          remaining={totalAssets}
          decimal={0}
        />
      </SplitBackground>
    );
  };

  renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.title.toUpperCase()}</Text>
      </View>
    );
  };

  renderSectionFooter = ({ section }) => {
    const options = {
      Assets: ['House', '401k', 'IRA'],
      Liabilities: ['Mortgage'],
    }[section.title]
      .filter(o => !section.data.map(o => o.name).includes(o))
      .map(o => ({ label: o, value: o }));

    const title = section.title === 'Assets' ? 'Asset' : 'Liability';
    return (
      <PrimaryButton
        disabled={options.length === 0}
        title={`Add ${title}`}
        onPress={() => {
          this.props.screenProps.layoutNavigate('NewMonthItemScreen', {
            section,
            title,
            options,
          });
        }}
      />
    );
  };

  deleteItem = item => {
    // eslint-disable-next-line
    console.log(item);
  };

  render() {
    const { month } = this.props.navigation.state.params;
    const sectionData = [
      { title: 'Assets', color: colors.success, data: month.assets },
      { title: 'Liabilities', color: colors.error, data: month.liabilities },
    ];

    return (
      <GroupList
        keyExtractor={i => i.id}
        sections={sectionData}
        renderHeader={this.renderHeader}
        renderSectionHeader={this.renderSectionHeader}
        renderSectionFooter={this.renderSectionFooter}
        onEdit={item => {
          this.props.screenProps.layoutNavigate('EditMonthItemScreen', {
            item,
          });
        }}
        onDelete={this.deleteItem}
        // renderEmptyComponent={this.empty}
      />
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: 'transparent',
    paddingVertical: 5,
  },
  headerText: {
    color: '#555',
    fontWeight: 'bold',
  },
});

export default MonthList;
