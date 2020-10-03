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
import { useMutation } from "react-apollo";
import gql from "graphql-tag";

const NET_WORTH_ITEM_IMPORT = gql`
  mutation NetWorthItemImport($year: Int!, $month: Int!) {
    netWorthItemImport(month: $month, year: $year) {
      message
      netWorth {
        id
        month
        year
        netWorthItems {
          id
          assetLiabilityId
        }
      }
    }
  }
`;

const ImportButton = ({ year, month, prevMonth }) => {
  const [importItems] = useMutation(NET_WORTH_ITEM_IMPORT, {
    variables: {
      year,
      month,
    },
  });

  const onPress = () => {
    confirm({
      okText: `Copy`,
      cancelText: "Cancel",
      title: "Copy Net Worth Items",
      content: `Do you want to copy net worth items from ${prevMonth}?`,
      onOk: () => {
        importItems().then(({ data }) => {
          if (data && data.netWorthItemImport) {
            notice(data.netWorthItemImport.message, 2000);
          }
        });
      },
      onCancel() {},
    });
  };

  return (
    <SecondaryButton title={`Copy ${prevMonth} Items`} onPress={onPress} />
  );
};
class MonthList extends Component {
  items = () => {
    const month = this.props.navigation.getParam("month");
    const assets = [];
    const liabilities = [];

    month.netWorthItems.forEach(i => {
      if (i.asset.isAsset) {
        assets.push(i);
      } else {
        liabilities.push(i);
      }
    });

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
    const nw = this.props.navigation.getParam("month");
    return (
      <ImportButton
        year={nw.year}
        month={nw.month}
        prevMonth={this.prevMonth()}
      />
    );
  };

  renderSectionFooter = ({ section }) => {
    const assets = this.props.navigation.getParam("assets");
    const liabilities = this.props.navigation.getParam("liabilities");

    const options = {
      Assets: assets,
      Liabilities: liabilities,
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
          return { ...a, name: a.asset.name };
        }),
      },
      {
        title: "Liabilities",
        color: colors.error,
        data: liabilities.map(l => {
          return { ...l, name: l.asset.name };
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
