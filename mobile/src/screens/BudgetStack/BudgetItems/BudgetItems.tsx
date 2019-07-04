import React, { PureComponent } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  View,
  FlatList,
} from "react-native";

// Redux
import { connect } from "react-redux";
import { importedBudgetItems, removeBudgetItem } from "@src/actions/budgets";

// API
import { ImportCategoryRequest } from "@shared/api/budgets";
import { DeleteItemRequest } from "@shared/api/budget-items";

// Helpers
import { BlurViewInsetProps } from "@src/utils/navigation-helpers";

// Components
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import { colors } from "@shared/theme";
import { notice, confirm } from "@src/notify";
import Progress from "@src/utils/Progress";
import { categoryImage } from "@src/assets/images";
import { reduceSum, percentSpent } from "@shared/helpers";
import { SecondaryButton } from "@src/forms";
import PlusButton from "@src/utils/PlusButton";
import Swipeout from "react-native-swipeout";

import Card, { SplitBackground } from "@src/components/Card";
import EmptyList from "@src/components/EmptyList";
import ListBackgroundFill from "@src/components/ListBackgroundFill";

class BudgetCategoryScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    const budgetCategory = params.budgetCategory;
    const onPress = () => {
      navigation.navigate("NewBudgetItem", {
        budgetCategory,
      });
    };
    return {
      headerRight: <PlusButton onPress={onPress} />,
    };
  };

  state = {
    scrollEnabled: true,
  };

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
      okText: `Copy ${budgetCategory.name}`,
      cancelText: "Cancel",
      title: "Copy Budget Items",
      content: `Do you want to copy budget items from your previous month's ${
        budgetCategory.name
      } category?`,
      onOk: this.importPreviousItems,
      onCancel() {},
    });
  };

  itemButtons = budgetItem => {
    return [
      {
        component: (
          <View
            style={{
              flex: 1,
              borderTopLeftRadius: 12,
              borderBottomLeftRadius: 12,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.primary,
            }}
          >
            <MaterialCommunityIcons name="pencil" color={"#fff"} size={20} />
          </View>
        ),
        backgroundColor: colors.clear,
        underlayColor: colors.primary + "70",
        onPress: () =>
          this.props.navigation.navigate("EditBudgetItem", {
            budgetItem,
          }),
      },
      {
        component: (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              borderRadius: 12,
              overflow: "hidden",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons name="delete" color={"#fff"} size={20} />
          </View>
        ),
        backgroundColor: colors.error,
        underlayColor: colors.error + "70",
        onPress: () => this.confirmDelete(budgetItem),
      },
    ];
  };

  renderItem = ({ item: budgetItem }) => {
    const expenses = this.props.budgetItemExpenses.filter(e => {
      return budgetItem.id === e.budgetItemId;
    });

    const amountSpent = reduceSum(expenses);
    const amountBudgeted = budgetItem.amount;
    const remaining = amountBudgeted - amountSpent;
    const percentage = percentSpent(amountBudgeted, amountSpent);
    let status = "normal";
    if (remaining < 0) {
      status = "exception";
    } else if (remaining === 0.0) {
      status = "success";
    }
    const buttons = this.itemButtons(budgetItem);

    return (
      <Swipeout
        buttonWidth={84}
        autoClose={true}
        scroll={scrollEnabled => {
          this.setState({ scrollEnabled });
        }}
        right={buttons}
      >
        <TouchableOpacity
          style={styles.itemRow}
          key={budgetItem.id}
          onPress={() => {
            this.props.navigation.navigate("BudgetItem", {
              budgetItem,
              amountSpent,
              amountBudgeted,
              remaining,
            });
          }}
        >
          <Card
            label={budgetItem.name}
            color={"#fff"}
            light={true}
            budgeted={amountBudgeted}
            spent={amountSpent}
            remaining={remaining}
          >
            <Progress percent={percentage} status={status} />
          </Card>
        </TouchableOpacity>
      </Swipeout>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  renderHeader = () => {
    const { budgetCategory } = this.props.navigation.state.params;
    const items = this.props.budgetItems.filter(
      i => i.budgetCategoryId === budgetCategory.id
    );
    const itemIds = items.map(i => {
      return i.id;
    });
    const expenses = this.props.budgetItemExpenses.filter(e => {
      return itemIds.includes(e.budgetItemId);
    });

    const amountSpent = reduceSum(expenses);
    const amountBudgeted = reduceSum(items);
    const remaining = amountBudgeted - amountSpent;

    return (
      <SplitBackground>
        <Card
          image={categoryImage(budgetCategory.name)}
          label={budgetCategory.name}
          budgeted={amountBudgeted}
          spent={amountSpent}
          remaining={remaining}
        />
      </SplitBackground>
    );
  };

  empty() {
    return <EmptyList message="There aren't any budget items yet" />;
  }

  deleteItem = async item => {
    const resp = await DeleteItemRequest(item.id);
    if (resp && resp.ok) {
      this.props.removeBudgetItem(item);
      notice(`${item.name} Deleted`);
    }
  };

  confirmDelete = item => {
    confirm({
      title: `Delete ${item.name}?`,
      okText: "Delete",
      onOk: () => {
        this.deleteItem(item);
      },
    });
  };

  render() {
    const currentMonth = this.props.budget.month;
    const previousMonthDigit = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousMonth = moment.months()[previousMonthDigit - 1];

    const category = this.props.navigation.getParam("budgetCategory");
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ListBackgroundFill />
        <FlatList
          {...BlurViewInsetProps}
          scrollEnabled={this.state.scrollEnabled}
          ListHeaderComponent={this.renderHeader}
          style={styles.list}
          contentContainerStyle={styles.contentStyles}
          keyExtractor={i => String(i.id)}
          data={category.budgetItems}
          renderItem={this.renderItem}
          ListEmptyComponent={this.empty}
          ListFooterComponent={
            <View style={{ paddingBottom: 30 }}>
              <SecondaryButton
                title={`Copy ${previousMonth} Items`}
                onPress={this.onImportPress}
              />
            </View>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "column",
  },
  list: {
    alignSelf: "stretch",
  },
  contentStyles: {
    backgroundColor: "#d8dce0",
    minHeight: "100%",
  },
  itemRow: {
    backgroundColor: "#d8dce0",
    justifyContent: "center",
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
    removeBudgetItem: budgetItem => {
      dispatch(removeBudgetItem(budgetItem));
    },
  })
)(BudgetCategoryScreen);
