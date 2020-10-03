import { FieldContainer, PrimaryButton, DangerButton } from "@src/forms";
import MoneyInput from "@src/forms/MoneyInput";
import gql from "graphql-tag";
import React, { useState } from "react";
import { useMutation } from "react-apollo";
import { TextInput, View } from "react-native";
import { BudgetItemInput } from "__generated__/globalTypes";
import {
  BudgetItemUpsert,
  BudgetItemUpsertVariables,
} from "./__generated__/BudgetItemUpsert";
import InsetScrollView from "@src/components/InsetScrollView";

const BUGET_ITEM_UPSERT = gql`
  mutation BudgetItemUpsert($budgetItemInput: BudgetItemInput!) {
    budgetItemUpsert(budgetItemInput: $budgetItemInput) {
      id
      budgetCategoryId
      amount
      name
    }
  }
`;

interface Props {
  item: BudgetItemInput;
  afterSubmit(): void;
  onCancel(): void;
}

const Form = ({ item, afterSubmit, onCancel }: Props) => {
  const [name, setName] = useState(item.name);
  const [amount, setAmount] = useState(String(item.amount));

  const valid = name.length > 0 && parseFloat(amount) > 0;
  const [budgetItemUpsert, { loading }] = useMutation<
    BudgetItemUpsert,
    BudgetItemUpsertVariables
  >(BUGET_ITEM_UPSERT, {
    variables: {
      budgetItemInput: {
        id: item.id,
        budgetCategoryId: item.budgetCategoryId,
        name,
        amount: parseFloat(amount),
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
            title="Amount"
            displayAmount={amount}
            defaultValue={(parseFloat(amount) * 100).toFixed()}
            onChange={setAmount}
          />
        </FieldContainer>

        <View style={{ height: 10 }} />

        <PrimaryButton
          title="Save Item"
          disabled={!valid}
          onPress={() => {
            budgetItemUpsert();
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
