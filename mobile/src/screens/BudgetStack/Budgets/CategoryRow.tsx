import React from "react";
import styled from "styled-components/native";
import { categoryImage } from "@src/assets/images";
import { reduceSum, percentSpent } from "@shared/helpers";
import { TouchableOpacity } from "react-native-gesture-handler";
import Card from "@src/components/Card";
import Progress from "@src/utils/Progress";
import { GetBudgets_budget_budgetCategories } from "./__generated__/GetBudgets";
import isEqual from "fast-deep-equal";

const Container = styled.View({
  backgroundColor: "#d8dce0",
});

interface Props {
  budgetCategory: GetBudgets_budget_budgetCategories;
  onPress(category: object): void;
}

const CategoryRow = ({ budgetCategory, onPress }: Props) => {
  const expenses = budgetCategory.budgetItems.flatMap(
    i => i.budgetItemExpenses
  );

  const amountSpent = reduceSum(expenses);
  const amountBudgeted = reduceSum(budgetCategory.budgetItems);
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

const skipUpdate = (prev: Props, next: Props) => {
  return isEqual(prev.budgetCategory, next.budgetCategory);
};

export default React.memo(CategoryRow, skipUpdate);
