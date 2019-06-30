import { reduceSum } from "@shared/helpers";
import { loadBudget, refreshBudget } from "@src/actions/budgets";
import ListBackgroundFill from "@src/components/ListBackgroundFill";
import { BlurViewInsetProps } from "@src/utils/navigation-helpers";
import Spin from "@src/utils/Spin";
import AskForReview from "@src/utils/StoreReview";
import React, { useEffect } from "react";
import { FlatList, RefreshControl, StatusBar } from "react-native";
import { connect } from "react-redux";
import styled from "styled-components/native";
import CategoryRow from "./CategoryRow";
import Footer from "./Footer";
import Header from "./Header";
import { NavigationScreenConfigProps } from "react-navigation";

const Container = styled.View({
  flex: 1,
  backgroundColor: "#fff",
});

interface LoadProps extends Pick<NavigationScreenConfigProps, "navigation"> {
  month: number;
  year: number;
}

interface Props extends NavigationScreenConfigProps {
  budget: any;
  budgetLoading: boolean;
  budgetRefreshing: boolean;
  loadBudget(props: LoadProps): void;
  refreshBudget(props: LoadProps): void;
  budgetItems: any[];
  budgetItemExpenses: any[];
  budgetCategories: any[];
}

const BudgetsScreen = ({
  budget,
  navigation,
  budgetLoading: loading,
  budgetRefreshing: refreshing,
  loadBudget,
  budgetItems,
  budgetItemExpenses,
  budgetCategories,
  refreshBudget,
}: Props) => {
  const load = ({ month, year }: { month: number; year: number }) => {
    loadBudget({ month, year, navigation });
    if (budgetItemExpenses.length > 0) {
      AskForReview();
    }
  };

  useEffect(() => {
    load({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
  }, []);

  const amountBudgeted = reduceSum(budgetItems);
  const amountSpent = reduceSum(budgetItemExpenses);
  const remaining = amountBudgeted - amountSpent;

  return (
    <>
      <StatusBar barStyle="dark-content" animated={true} />
      <Container>
        <ListBackgroundFill />
        <FlatList
          {...BlurViewInsetProps}
          contentInsetAdjustmentBehavior="automatic"
          refreshControl={
            <RefreshControl
              tintColor={"lightskyblue"}
              refreshing={refreshing}
              onRefresh={() =>
                refreshBudget({
                  month: budget.month,
                  year: budget.year,
                  navigation,
                })
              }
            />
          }
          keyExtractor={i => String(i.id)}
          data={budgetCategories}
          renderItem={({ item }) => (
            <CategoryRow
              onPress={budgetCategory => {
                navigation.navigate("BudgetCategory", {
                  budgetCategory,
                });
              }}
              budgetCategory={item}
              budgetItems={budgetItems}
              budgetItemExpenses={budgetItemExpenses}
            />
          )}
          ListFooterComponent={() => (
            <Footer
              onPress={() => {
                navigation.navigate("ImportExpenses");
              }}
            />
          )}
          ListHeaderComponent={() => (
            <Header
              budget={budget}
              amountBudgeted={amountBudgeted}
              amountSpent={amountSpent}
              remaining={remaining}
              onChange={load}
            />
          )}
        />
        <Spin spinning={loading && !refreshing} />
      </Container>
    </>
  );
};

export default connect(
  (state: any) => ({
    ...state.budget,
  }),
  (dispatch: (a: any) => void) => ({
    loadBudget: ({ month, year, navigation }: any) => {
      dispatch(loadBudget({ month, year, navigation }));
    },
    refreshBudget: ({ month, year, navigation }: any) => {
      dispatch(refreshBudget({ month, year, navigation }));
    },
  })
)(BudgetsScreen);
