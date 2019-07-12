import { reduceSum, defaultDate } from "@shared/helpers";
import ListBackgroundFill from "@src/components/ListBackgroundFill";
import { BlurViewInsetProps } from "@src/utils/navigation-helpers";
import Spin from "@src/utils/Spin";
import AskForReview from "@src/utils/StoreReview";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StatusBar } from "react-native";
import styled from "styled-components/native";
import CategoryRow from "./CategoryRow";
import Footer from "./Footer";
import Header from "./Header";
import { NavigationScreenConfigProps } from "react-navigation";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { BudgetCategory, BudgetItem, BudgetItemExpense } from "../types";
import useRegisterForPushNotificationsAsync from "@src/utils/registerForPushNotifications";

export const GET_BUDGET = gql`
  query GetBudgets($year: Int!, $month: Int!) {
    budget(year: $year, month: $month) {
      budgetCategories {
        id
        name
        budgetItems {
          id
          name
          amount
          budgetCategoryId
          budgetItemExpenses {
            id
            name
            date
            amount
            budgetItemId
          }
        }
      }
      id
      income
      month
      year
    }
  }
`;

const Container = styled.View({
  flex: 1,
  backgroundColor: "#fff",
});

interface Props extends NavigationScreenConfigProps {}

const BudgetsScreen = ({ navigation }: Props) => {
  useRegisterForPushNotificationsAsync();

  const [year, setYear] = useState(defaultDate.year);
  const [month, setMonth] = useState(defaultDate.month);
  const [refreshing, setRefreshing] = useState(false);
  const { loading, data, refetch } = useQuery(GET_BUDGET, {
    variables: { year, month },
  });

  const { budget = { year, month, budgetCategories: [] } } = data;
  const budgetCategories: BudgetCategory[] = budget.budgetCategories;
  const items = budgetCategories.flatMap<BudgetItem>(c => c.budgetItems);
  const expenses = items.flatMap<BudgetItemExpense>(i => i.budgetItemExpenses);

  const onDateChange = ({ month, year }: { month: number; year: number }) => {
    navigation.setParams({ year, month });
    setYear(year);
    setMonth(month);
  };

  useEffect(() => {
    refetch({ month, year });
    if (expenses.length > 0) {
      AskForReview();
    }
  }, [month, year]);

  useEffect(() => {
    if (refreshing) {
      refetch({ year, month });
      setRefreshing(false);
    }
  }, [year, month, refreshing]);

  const amountBudgeted = reduceSum(items);
  const amountSpent = reduceSum(expenses);
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
              onRefresh={() => {
                setRefreshing(true);
              }}
            />
          }
          keyExtractor={(i: BudgetCategory) => String(i.id)}
          data={budgetCategories}
          renderItem={({ item }: { item: BudgetCategory }) => (
            <CategoryRow
              onPress={() => {
                navigation.navigate("BudgetCategory", {
                  budgetCategory: item,
                  year,
                  month,
                });
              }}
              budgetCategory={item}
            />
          )}
          ListFooterComponent={() => (
            <Footer
              onPress={() => {
                navigation.navigate("ImportExpenses", { month, year });
              }}
            />
          )}
          ListHeaderComponent={() => (
            <Header
              budget={budget}
              amountBudgeted={amountBudgeted}
              amountSpent={amountSpent}
              remaining={remaining}
              onChange={onDateChange}
            />
          )}
        />
        <Spin spinning={loading} />
      </Container>
    </>
  );
};

export default BudgetsScreen;
