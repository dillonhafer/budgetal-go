import { BudgetItem } from "../types";
import React from "react";
import { reduceSum } from "@shared/helpers";
import Card, { SplitBackground } from "@src/components/Card";
import { categoryImage } from "@src/assets/images";

interface Props {
  categoryName: string;
  budgetItems: BudgetItem[];
}

const Header = ({ categoryName, budgetItems }: Props) => {
  const expenses = budgetItems.flatMap(i => i.budgetItemExpenses);
  const amountSpent = reduceSum(expenses);
  const amountBudgeted = reduceSum(budgetItems);
  const remaining = amountBudgeted - amountSpent;

  return (
    <SplitBackground>
      <Card
        image={categoryImage(categoryName)}
        label={categoryName}
        budgeted={amountBudgeted}
        spent={amountSpent}
        remaining={remaining}
      />
    </SplitBackground>
  );
};

export default Header;
