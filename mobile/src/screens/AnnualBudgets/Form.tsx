import {
  CustomFieldContainer,
  FieldContainer,
  PrimaryButton,
} from "@src/forms";
import DateInput from "@src/forms/DateInput";
import MoneyInput from "@src/forms/MoneyInput";
import SelectInput from "@src/forms/SelectInput";
import SwitchInput from "@src/forms/SwitchInput";
import { range } from "lodash";
import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";
import moment from "moment";
import {
  AnnualBudgetItemUpsert,
  AnnualBudgetItemUpsertVariables,
} from "./__generated__/AnnualBudgetItemUpsert";
import { AnnualBudgetItemInput } from "__generated__/globalTypes";

const ANNUAL_BUGET_ITEM_UPSERT = gql`
  mutation AnnualBudgetItemUpsert(
    $annualBudgetItemInput: AnnualBudgetItemInput!
  ) {
    annualBudgetItemUpsert(annualBudgetItemInput: $annualBudgetItemInput) {
      amount
      annualBudgetId
      dueDate
      id
      interval
      name
      paid
    }
  }
`;

interface Props {
  item: AnnualBudgetItemInput;
  afterSubmit(): void;
}

const Form = ({ item, afterSubmit }: Props) => {
  const [name, setName] = useState(item.name);
  const [dueDate, setDueDate] = useState(moment(item.dueDate));
  const [amount, setAmount] = useState(String(item.amount));
  const [interval, setInterval] = useState(item.interval);
  const [paid, setPaid] = useState(item.paid);

  const valid = name.length > 0 && parseFloat(amount) > 0 && dueDate.isValid();
  const [annualBudgetItemUpsert, { loading }] = useMutation<
    AnnualBudgetItemUpsert,
    AnnualBudgetItemUpsertVariables
  >(ANNUAL_BUGET_ITEM_UPSERT, {
    variables: {
      annualBudgetItemInput: {
        id: item.id,
        annualBudgetId: item.annualBudgetId,
        name,
        dueDate: dueDate.format(),
        amount,
        interval,
        paid,
      },
    },
    refetchQueries: ["GetAnnualBudget"],
  });

  return (
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
      <CustomFieldContainer>
        <DateInput defaultValue={dueDate} onChange={setDueDate} />
      </CustomFieldContainer>

      <CustomFieldContainer>
        <SelectInput
          placeholder="Interval"
          defaultValue={interval}
          onChange={(interval: string) => setInterval(parseInt(interval))}
          data={range(1, 13).map(n => {
            return { label: String(n), value: String(n) };
          })}
        />
      </CustomFieldContainer>

      <CustomFieldContainer>
        <SwitchInput label="Paid" defaultValue={paid} onChange={setPaid} />
      </CustomFieldContainer>

      <View style={{ height: 10 }} />

      <PrimaryButton
        title="Save Item"
        disabled={!valid}
        onPress={() => {
          annualBudgetItemUpsert();
          afterSubmit();
        }}
        loading={!valid || loading}
      />
    </>
  );
};

export default Form;
