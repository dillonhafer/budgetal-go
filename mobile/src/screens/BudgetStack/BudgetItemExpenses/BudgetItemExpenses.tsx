import { reduceSum } from "@shared/helpers";
import Card, { SplitBackground } from "@src/components/Card";
import EmptyList from "@src/components/EmptyList";
import Expense from "@src/components/Expense";
import ListBackgroundFill from "@src/components/ListBackgroundFill";
import { BlurViewInsetProps } from "@src/utils/navigation-helpers";
import PlusButton from "@src/utils/PlusButton";
import { groupBy, orderBy, transform } from "lodash";
import React, { useState } from "react";
import { useQuery } from "react-apollo";
import { SectionList, StatusBar } from "react-native";
import {
  NavigationScreenConfigProps,
  NavigationScreenProps,
} from "react-navigation";
import styled from "styled-components/native";
import { GET_BUDGET } from "../Budgets/Budgets";
import {
  GetBudgets,
  GetBudgetsVariables,
} from "../Budgets/__generated__/GetBudgets";
import { BudgetItem, BudgetItemExpense } from "../types";
import SectionHeader from "./SectionHeader";
import { colors } from "@shared/theme";

const Container = styled.View({
  flex: 1,
  backgroundColor: "#fff",
});

interface Props extends NavigationScreenConfigProps {}

const BudgetItemExpensesScreen = ({ navigation }: Props) => {
  const year = navigation.getParam("year");
  const month = navigation.getParam("month");
  const paramItem = navigation.getParam("budgetItem");

  const { data } = useQuery<GetBudgets, GetBudgetsVariables>(GET_BUDGET, {
    fetchPolicy: "cache-first",
    variables: {
      year,
      month,
    },
  });

  let expenses: BudgetItemExpense[] = [];
  let budgetItem = paramItem;

  if (data && data.budget) {
    const item = data.budget.budgetCategories
      .flatMap<BudgetItem>(c => c.budgetItems)
      .find(i => i.id === paramItem.id);

    if (item) {
      budgetItem = item;
      expenses = budgetItem.budgetItemExpenses;
    }
  }

  const [selectedExpense, setSelectedExpense] = useState("");
  const toggleVisibleExpense = (id: string) => {
    setSelectedExpense(id === selectedExpense ? "" : id);
  };

  const amountSpent = reduceSum(expenses);
  const amountBudgeted = parseFloat(budgetItem.amount);
  const remaining = amountBudgeted - amountSpent;
  const sections = transform(
    groupBy(orderBy(expenses, ["date", "id"], ["desc", "desc"]), "date"),
    (result, value, key) => {
      result.push({ data: value, title: key });
    },
    []
  );

  const expenseSections = sections.map(sec => {
    return {
      ...sec,
      data: sec.data.map((ex, i) => {
        let position = "";

        if (i === 0) {
          position = "first";
        }

        if (i === sec.data.length - 1) {
          position = "last";
        }

        if (sec.data.length === 1) {
          position = "only";
        }

        return { ...ex, position };
      }),
    };
  });

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Container>
        <ListBackgroundFill />
        <SectionList
          {...BlurViewInsetProps}
          contentInsetAdjustmentBehavior="automatic"
          stickySectionHeadersEnabled={false}
          keyExtractor={i => i.id}
          sections={expenseSections}
          renderItem={({ item }: { item: BudgetItemExpense }) => {
            const active = selectedExpense === item.id;
            return (
              <Expense
                expense={item}
                active={active}
                navigation={navigation}
                removeExpense={() => {}}
                toggleVisibleExpense={toggleVisibleExpense}
              />
            );
          }}
          ListEmptyComponent={() => (
            <EmptyList message="There aren't any expenses yet" />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <SectionHeader title={title} />
          )}
          ListHeaderComponent={() => (
            <SplitBackground>
              <Card
                label={budgetItem.name}
                budgeted={amountBudgeted}
                spent={amountSpent}
                remaining={remaining}
              />
            </SplitBackground>
          )}
        />
      </Container>
    </>
  );
};

BudgetItemExpensesScreen.navigationOptions = ({
  navigation,
}: NavigationScreenProps<any>) => {
  const budgetItemId = navigation.getParam("budgetItem").id;

  const onPress = () => {
    navigation.navigate("NewBudgetItemExpense", {
      budgetItemId,
    });
  };

  return {
    headerRight: <PlusButton onPress={onPress} />,
  };
};

export default BudgetItemExpensesScreen;
