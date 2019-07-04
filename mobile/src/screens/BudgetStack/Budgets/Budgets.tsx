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
import { useQuery } from "@apollo/react-hooks";
import {
  GetBudgets_budget_budgetCategories,
  GetBudgets_budget_budgetCategories_budgetItems,
  GetBudgets_budget_budgetCategories_budgetItems_budgetItemExpenses,
} from "./__generated__/GetBudgets";

interface BudgetCategory extends GetBudgets_budget_budgetCategories {}
interface BudgetItem extends GetBudgets_budget_budgetCategories_budgetItems {}
interface BudgetItemExpense
  extends GetBudgets_budget_budgetCategories_budgetItems_budgetItemExpenses {}

const GET_BUDGET = gql`
  query GetBudgets($year: Int!, $month: Int!) {
    budget(year: $year, month: $month) {
      budgetCategories {
        id
        name
        budgetItems {
          id
          name
          amount
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
  const [year, setYear] = useState(defaultDate.year);
  const [month, setMonth] = useState(defaultDate.month);
  const [refreshing, setRefreshing] = useState(false);
  const { loading, data, refetch } = useQuery(GET_BUDGET, {
    variables: { year, month },
  });

  const { budget = { year, month } } = data;
  const budgetCategories: BudgetCategory[] =
    budget && budget.budgetCategories ? budget.budgetCategories : [];

  let items = budgetCategories.flatMap<BudgetItem>(c => c.budgetItems);
  let expenses = items.flatMap<BudgetItemExpense>(i => i.budgetItemExpenses);

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
                });
              }}
              budgetCategory={item}
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
