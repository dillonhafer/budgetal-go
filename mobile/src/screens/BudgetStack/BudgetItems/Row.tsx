import Card from "@src/components/Card";
import Progress from "@src/utils/Progress";
import React from "react";
import Swipeout from "react-native-swipeout";
import { BudgetItem } from "../types";
import { reduceSum, percentSpent } from "@shared/helpers";
import styled from "styled-components/native";
import { colors } from "@shared/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { confirm, notice } from "@src/notify";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";
import {
  BudgetItemDelete,
  BudgetItemDeleteVariables,
} from "./__generated__/BudgetItemDelete";

const BUDGET_ITEM_DELETE = gql`
  mutation BudgetItemDelete($id: ID!) {
    budgetItemDelete(id: $id) {
      id
    }
  }
`;

const SwipeButton = styled.View<{ color: string; borderRadius: number }>(
  props => ({
    flex: 1,
    borderRadius: 0,
    borderTopLeftRadius: props.borderRadius,
    borderBottomLeftRadius: props.borderRadius,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: props.color,
  })
);

const confirmDelete = (
  budgetItem: BudgetItem,
  deleteItem: () => Promise<void>
) => {
  confirm({
    title: `Delete ${budgetItem.name}?`,
    okText: "Delete",
    onOk: () => {
      deleteItem().then(() => {
        notice(`${budgetItem.name} Deleted`);
      });
    },
  });
};

const itemButtons = (
  budgetItem: BudgetItem,
  onEdit: () => void,
  onDelete: () => any
) => {
  return [
    {
      component: (
        <SwipeButton borderRadius={12} color={colors.primary}>
          <MaterialCommunityIcons name="pencil" color={"#fff"} size={20} />
        </SwipeButton>
      ),
      backgroundColor: colors.clear,
      underlayColor: colors.primary + "70",
      onPress: onEdit,
    },
    {
      component: (
        <SwipeButton borderRadius={0} color={colors.error}>
          <MaterialCommunityIcons name="delete" color={"#fff"} size={20} />
        </SwipeButton>
      ),
      backgroundColor: colors.error,
      underlayColor: colors.error + "70",
      onPress: () => confirmDelete(budgetItem, onDelete),
    },
  ];
};

const RowButton = styled.TouchableOpacity({
  backgroundColor: colors.backgroundColor,
  justifyContent: "center",
});

interface Props {
  budgetItem: BudgetItem;
  onPress(): void;
  onEdit(): void;
}

const Row = ({ budgetItem, onPress, onEdit }: Props) => {
  const amountSpent = reduceSum(budgetItem.budgetItemExpenses);
  const amountBudgeted = parseFloat(budgetItem.amount);
  const remaining = amountBudgeted - amountSpent;
  const percentage = percentSpent(amountBudgeted, amountSpent);
  let status = "normal";
  if (remaining < 0) {
    status = "exception";
  } else if (remaining === 0.0) {
    status = "success";
  }

  const [budgetItemDelete] = useMutation<
    BudgetItemDelete,
    BudgetItemDeleteVariables
  >(BUDGET_ITEM_DELETE, {
    variables: {
      id: budgetItem.id,
    },
    refetchQueries: ["GetBudgets"],
  });

  const buttons = itemButtons(budgetItem, onEdit, budgetItemDelete);

  return (
    <Swipeout buttonWidth={84} autoClose={true} right={buttons}>
      <RowButton key={budgetItem.id} onPress={onPress}>
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
      </RowButton>
    </Swipeout>
  );
};

export default Row;
