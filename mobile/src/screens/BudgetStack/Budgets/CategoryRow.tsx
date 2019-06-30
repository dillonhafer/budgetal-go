import React from "react";
import styled from "styled-components/native";
import { categoryImage } from "@src/assets/images";
import { reduceSum, percentSpent } from "@shared/helpers";
import { TouchableOpacity } from "react-native-gesture-handler";
import Card from "@src/components/Card";
import Progress from "@src/utils/Progress";

const Container = styled.View({
  backgroundColor: "#d8dce0",
});

interface Props {
  budgetItems: object[];
  budgetItemExpenses: object[];
  budgetCategory: object;
  onPress(category: object): void;
}

const CategoryRow = ({
  budgetCategory,
  budgetItems,
  budgetItemExpenses,
  onPress,
}: Props) => {
  const items = budgetItems.filter(
    i => i.budgetCategoryId === budgetCategory.id
  );
  const itemIds = items.map(i => {
    return i.id;
  });
  const expenses = budgetItemExpenses.filter(e => {
    return itemIds.includes(e.budgetItemId);
  });

  const amountSpent = reduceSum(expenses);
  const amountBudgeted = reduceSum(items);
  const remaining = amountBudgeted - amountSpent;
  const percent = percentSpent(amountBudgeted, amountSpent);
  let status = "normal";
  if (remaining < 0) {
    status = "exception";
  } else if (remaining === 0.0) {
    status = "success";
  }

  return (
    <Container>
      <TouchableOpacity
        key={budgetCategory.id}
        activeOpacity={0.6}
        onPress={() => {
          onPress(budgetCategory);
        }}
      >
        <Card
          image={categoryImage(budgetCategory.name)}
          label={budgetCategory.name}
          color={"#fff"}
          light={true}
          budgeted={amountBudgeted}
          spent={amountSpent}
          remaining={remaining}
        >
          <Progress percent={percent} status={status} />
        </Card>
      </TouchableOpacity>
    </Container>
  );
};

export default CategoryRow;
