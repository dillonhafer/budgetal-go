import { MaterialCommunityIcons } from "@expo/vector-icons";
import { currencyf } from "@shared/helpers";
import { colors } from "@shared/theme";
import { Medium } from "@src/components/Text";
import { confirm, notice } from "@src/notify";
import isEqual from "fast-deep-equal";
import gql from "graphql-tag";
import React from "react";
import { useMutation } from "react-apollo";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { BudgetItemExpense } from "../types";
import {
  BudgetItemExpenseDelete,
  BudgetItemExpenseDeleteVariables,
} from "./__generated__/BudgetItemExpenseDelete";

export type Position = "only" | "first" | "last" | "";

const BUDGET_ITEM_EXPENSE_DELETE = gql`
  mutation BudgetItemExpenseDelete($id: ID!) {
    budgetItemExpenseDelete(id: $id) {
      id
    }
  }
`;

const topRadius = (position: Position) =>
  ["only", "first"].includes(position) ? 9 : 0;

const bottomRadius = (position: Position) =>
  ["only", "last"].includes(position) ? 9 : 0;

const Container = styled.View({
  paddingHorizontal: 20,
});

const ExpenseRowContainer = styled.View<{
  position: Position;
}>(({ position }) => ({
  flex: 1,
  boxShadow: "0px 5px 3px rgba(170, 170, 170, 0.6)",
  backgroundColor: "#fff",
  padding: 10,
  paddingVertical: 15,
  borderBottomLeftRadius: bottomRadius(position),
  borderBottomRightRadius: bottomRadius(position),
  borderTopLeftRadius: topRadius(position),
  borderTopRightRadius: topRadius(position),
}));

const ViewRow = styled.View({
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
});

const AmountText = styled(Medium)({
  color: colors.error,
  fontWeight: 800,
  fontSize: 16,
  textAlign: "right",
});

const NameText = styled(Medium).attrs({
  adjustsFontSizeToFit: true,
  minimumFontScale: 0.03,
  numberOfLines: 2,
  ellipsizeMode: "middle",
})({
  fontWeight: "bold",
});

const OptionsIcon = styled(MaterialCommunityIcons).attrs({
  name: "dots-horizontal-circle",
  size: 22,
})({
  alignItems: "center",
  justifyContent: "center",
  height: 24,
  width: 24,
  marginRight: 5,
  color: "#aaa",
});

const CrudRow = styled.View({
  flexDirection: "row",
  marginTop: 10,
});

const ButtonRow = styled.View({
  flex: 1,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
});

interface CrudButtonProps {
  color: string;
  onPress(): void;
  icon: "pencil" | "delete";
  text: string;
}

const CrudButtonTouchable = styled.TouchableOpacity({
  flex: 1,
});

const CrudButton = ({ color, onPress, icon, text }: CrudButtonProps) => (
  <CrudButtonTouchable onPress={onPress}>
    <ButtonRow>
      <MaterialCommunityIcons
        name={icon}
        color={color}
        size={20}
        style={{ marginRight: 5 }}
      />
      <Medium style={{ color }}>{text}</Medium>
    </ButtonRow>
  </CrudButtonTouchable>
);

export interface Expense extends BudgetItemExpense {
  position: Position;
}

interface Props {
  expense: Expense;
  active: boolean;
  toggleVisibleExpense(id: string): void;
  onEdit(): void;
}

const Row = ({ expense, active, onEdit, toggleVisibleExpense }: Props) => {
  const [expenseDelete] = useMutation<
    BudgetItemExpenseDelete,
    BudgetItemExpenseDeleteVariables
  >(BUDGET_ITEM_EXPENSE_DELETE, {
    variables: {
      id: expense.id,
    },
    refetchQueries: ["GetBudgets"],
  });

  const confirmDelete = () => {
    confirm({
      title: `Delete ${expense.name}?`,
      okText: "Delete",
      onOk: () => {
        expenseDelete().then(() => {
          notice(`${expense.name} Deleted`);
        });
      },
    });
  };

  return (
    <Container>
      <ExpenseRowContainer position={expense.position}>
        <ViewRow>
          <ViewRow>
            <TouchableOpacity
              onPress={() => {
                toggleVisibleExpense(expense.id);
              }}
            >
              <OptionsIcon />
            </TouchableOpacity>
            <NameText>{expense.name}</NameText>
          </ViewRow>
          <AmountText>{currencyf(expense.amount)}</AmountText>
        </ViewRow>
        {active && (
          <CrudRow>
            <CrudButton
              icon="pencil"
              onPress={onEdit}
              color={colors.primary}
              text="EDIT"
            />
            <CrudButton
              icon="delete"
              onPress={confirmDelete}
              color={colors.error}
              text="DELETE"
            />
          </CrudRow>
        )}
      </ExpenseRowContainer>
    </Container>
  );
};

const shouldSkip = (prev: Props, next: Props) =>
  isEqual(prev.active, next.active) && isEqual(prev.expense, next.expense);

export default React.memo(Row, shouldSkip);
