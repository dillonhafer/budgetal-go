import EmptyList from "@src/components/EmptyList";
import ListBackgroundFill from "@src/components/ListBackgroundFill";
import { BlurViewInsetProps } from "@src/utils/navigation-helpers";
import PlusButton from "@src/utils/PlusButton";
import React from "react";
import { useApolloClient } from "react-apollo";
import { FlatList, StatusBar } from "react-native";
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
import { BudgetCategory, BudgetItem } from "../types";
import Footer from "./Footer";
import Header from "./Header";
import Row from "./Row";

const Container = styled.View({
  flex: 1,
  backgroundColor: "#fff",
});

interface Props extends NavigationScreenConfigProps {}

const BudgetItemsScreen = ({ navigation }: Props) => {
  const year = navigation.getParam("year");
  const month = navigation.getParam("month");
  const budgetCategory = navigation.getParam("budgetCategory");
  const budgetCategoryId = budgetCategory.id;

  const client = useApolloClient();
  const data = client.readQuery<GetBudgets, GetBudgetsVariables>({
    query: GET_BUDGET,
    variables: {
      year,
      month,
    },
  });

  const budgetCategories: BudgetCategory[] = data
    ? data.budget.budgetCategories
    : [];

  const category = budgetCategories.find(
    (c: BudgetCategory) => c.id === budgetCategoryId
  );

  const items = category ? category.budgetItems : [];

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Container>
        <ListBackgroundFill />
        <FlatList
          {...BlurViewInsetProps}
          contentInsetAdjustmentBehavior="automatic"
          keyExtractor={i => String(i.id)}
          data={items}
          renderItem={({ item }: { item: BudgetItem }) => (
            <Row
              budgetItem={item}
              onEdit={() => {
                navigation.navigate("EditBudgetItem", {
                  budgetItem: item,
                });
              }}
              onPress={() => {
                navigation.navigate("BudgetItem", {
                  item,
                });
              }}
            />
          )}
          ListEmptyComponent={() => (
            <EmptyList message="There aren't any budget items yet" />
          )}
          ListHeaderComponent={() => (
            <Header budgetItems={items} categoryName={budgetCategory.name} />
          )}
          ListFooterComponent={() => (
            <Footer budgetCategory={budgetCategory} month={month} />
          )}
        />
      </Container>
    </>
  );
};

BudgetItemsScreen.navigationOptions = ({
  navigation,
}: NavigationScreenProps<any>) => {
  const budgetCategory = navigation.getParam("budgetCategory");
  const onPress = () => {
    navigation.navigate("NewBudgetItem", {
      budgetCategory,
    });
  };
  return {
    headerRight: <PlusButton onPress={onPress} />,
  };
};

export default BudgetItemsScreen;
