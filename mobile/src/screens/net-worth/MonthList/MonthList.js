import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import Card, { SplitBackground } from "@src/components/Card";
import { colors } from "@shared/theme";
import GroupList from "@src/components/GroupList";
import { SecondaryButton, PrimaryButton } from "@src/forms";
import { Bold } from "@src/components/Text";
import { groupBy } from "lodash";
import { reduceSum, monthName } from "@shared/helpers";
import { notice, confirm, error } from "@src/notify";

class MonthList extends Component {
  items = () => {
    const pm = this.props.navigation.getParam("month");
    const month = this.props.months.find(
      m => m.year === pm.year && m.month === pm.month
    );

    const { true: assets = [], false: liabilities = [] } = groupBy(
      month.items,
      "isAsset"
    );

    return { assets, liabilities };
  };

  importPreviousItems = async () => {
    const nw = this.props.navigation.getParam("month");
    this.props.importNetWorthItems(nw).catch(() => {
      error(`COULD NOT IMPORT`);
    });
  };

  onImportPress = () => {
    confirm({
      okText: `Copy`,
      cancelText: "Cancel",
      title: "Copy Net Worth Items",
      content: `Do you want to copy net worth items from ${this.prevMonth()}?`,
      onOk: this.importPreviousItems,
      onCancel() {},
    });
  };

  deleteItem = item => {
    this.setState({ loading: true });
    const name = item.name.toUpperCase();

    this.props
      .deleteNetWorthItem({ item })
      .then(() => {
        notice(`DELETED ${name}`);
      })
      .catch(() => {
        error(`COULD NOT DELETE ${name}`);
      })
      .then(() => {
        this.setState({ loading: false });
      });
  };

  renderHeader = () => {
    const month = this.props.navigation.getParam("month");
    const year = this.props.navigation.getParam("year");

    const { assets, liabilities } = this.items();
    const totalAssets = reduceSum(assets);
    const totalLiabilities = reduceSum(liabilities);
    const netWorth = totalAssets - totalLiabilities;

    return (
      <SplitBackground>
        <Card
          label={`${month.label} ${year}`}
          budgeted={netWorth}
          spent={totalLiabilities}
          spentLabel={"Liabilities"}
          remainingLabel={"Assets"}
          remaining={totalAssets}
          decimal={0}
        />
      </SplitBackground>
    );
  };

  renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.header}>
        <Bold style={styles.headerText}>{section.title.toUpperCase()}</Bold>
      </View>
    );
  };

  prevMonth = () => {
    const nw = this.props.navigation.getParam("month");
    return monthName(nw.month === 1 ? 12 : nw.month - 1);
  };

  renderFooter = () => {
    return (
      <SecondaryButton
        title={`Copy ${this.prevMonth()} Items`}
        onPress={this.onImportPress}
      />
    );
  };

  renderSectionFooter = ({ section }) => {
    const options = {
      Assets: this.props.assets,
      Liabilities: this.props.liabilities,
    }[section.title]
      .filter(o => !section.data.map(o => o.assetId).includes(o.id))
      .map(o => ({ label: o.name, value: o.id }));

    const { year, month } = this.props.navigation.getParam("month");
    const title = section.title === "Assets" ? "Asset" : "Liability";
    return (
      <PrimaryButton
        disabled={options.length === 0}
        title={`Add ${title}`}
        onPress={() => {
          this.props.navigation.navigate("NewMonthItemScreen", {
            section,
            title,
            options,
            year,
            month,
          });
        }}
      />
    );
  };

  render() {
    const { assets, liabilities } = this.items();
    const sectionData = [
      {
        title: "Assets",
        color: colors.success,
        data: assets.map(a => {
          const name = this.props.assets.find(as => as.id === a.assetId).name;
          return { ...a, name };
        }),
      },
      {
        title: "Liabilities",
        color: colors.error,
        data: liabilities.map(l => {
          const name = this.props.liabilities.find(as => as.id === l.assetId)
            .name;
          return { ...l, name };
        }),
      },
    ];

    return (
      <GroupList
        keyExtractor={i => i.id}
        sections={sectionData}
        renderHeader={this.renderHeader}
        renderFooter={this.renderFooter}
        renderSectionHeader={this.renderSectionHeader}
        renderSectionFooter={this.renderSectionFooter}
        onEdit={item => {
          this.props.navigation.navigate("EditMonthItemScreen", {
            item,
          });
        }}
        onDelete={this.deleteItem}
      />
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "transparent",
    paddingVertical: 5,
  },
  headerText: {
    color: "#555",
    fontWeight: "bold",
  },
});

export default MonthList;
