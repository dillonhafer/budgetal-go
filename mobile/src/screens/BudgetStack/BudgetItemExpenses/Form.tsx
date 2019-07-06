import {
  FieldContainer,
  PrimaryButton,
  CustomFieldContainer,
  DangerButton,
} from "@src/forms";
import MoneyInput from "@src/forms/MoneyInput";
import gql from "graphql-tag";
import React, { useState } from "react";
import { useMutation } from "react-apollo";
import { TextInput, View } from "react-native";
import { BudgetItemExpenseInput } from "__generated__/globalTypes";
import {
  BudgetItemExpenseUpsert,
  BudgetItemExpenseUpsertVariables,
} from "./__generated__/BudgetItemExpenseUpsert";
import DateInput from "@src/forms/DateInput";
import InsetScrollView from "@src/components/InsetScrollView";
import moment from "moment";

const BUGET_ITEM_EXPENSE_UPSERT = gql`
  mutation BudgetItemExpenseUpsert(
    $budgetItemExpenseInput: BudgetItemExpenseInput!
  ) {
    budgetItemExpenseUpsert(budgetItemExpenseInput: $budgetItemExpenseInput) {
      id
      budgetItemId
      amount
      date
      name
    }
  }
`;

interface Props {
  expense: BudgetItemExpenseInput;
  afterSubmit(): void;
  onCancel(): void;
}

const Form = ({ expense, afterSubmit, onCancel }: Props) => {
  const [name, setName] = useState(expense.name);
  const [amount, setAmount] = useState(String(expense.amount));
  const [date, setDate] = useState(moment(expense.date.slice(0, 10)));

  const valid = name.length > 0 && parseFloat(amount) > 0 && date.isValid();

  const [budgetItemExpenseUpsert, { loading }] = useMutation<
    BudgetItemExpenseUpsert,
    BudgetItemExpenseUpsertVariables
  >(BUGET_ITEM_EXPENSE_UPSERT, {
    variables: {
      budgetItemExpenseInput: {
        id: expense.id,
        budgetItemId: expense.budgetItemId,
        name,
        amount: parseFloat(amount),
        date: date.format("YYYY-MM-DD"),
      },
    },
    refetchQueries: ["GetBudgets"],
  });

  return (
    <InsetScrollView>
      <>
        <FieldContainer position="first">
          <TextInput
            style={{ height: 50 }}
            placeholder="Name"
            defaultValue={name}
            autoFocus
            underlineColorAndroid={"transparent"}
            returnKeyType="next"
            onChangeText={setName}
          />
        </FieldContainer>
        <FieldContainer>
          <MoneyInput
            title="Expense Amount"
            displayAmount={amount}
            defaultValue={(parseFloat(amount) * 100).toFixed()}
            onChange={setAmount}
          />
        </FieldContainer>

        <CustomFieldContainer>
          <DateInput defaultValue={date} onChange={setDate} />
        </CustomFieldContainer>

        <View style={{ height: 10 }} />

        <PrimaryButton
          title="Save Expense"
          disabled={!valid}
          onPress={() => {
            budgetItemExpenseUpsert();
            afterSubmit();
          }}
          loading={!valid || loading}
        />
        <DangerButton title="Cancel" onPress={onCancel} />
      </>
    </InsetScrollView>
  );
};

export default Form;
