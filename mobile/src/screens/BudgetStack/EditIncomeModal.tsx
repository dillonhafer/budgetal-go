import { Ionicons } from "@expo/vector-icons";
import { currencyf } from "@shared/helpers";
import MoneyInputModal from "@src/forms/MoneyInputModal";
import { notice, error } from "@src/notify";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useQuery, useMutation } from "react-apollo";
import {
  BudgetIncomeUpdate,
  BudgetIncomeUpdateVariables,
} from "./__generated__/BudgetIncomeUpdate";
import styled from "styled-components/native";
import {
  GetBudgetIncomeVariables,
  GetBudgetIncome,
} from "./__generated__/GetBudgetIncome";

const CashIcon = styled(Ionicons).attrs({
  name: "ios-cash",
  size: 30,
  color: "#037aff",
})({
  paddingRight: 15,
});

const TitleText = styled.Text<{ bold?: boolean }>(({ bold = false }) => ({
  fontWeight: bold ? 700 : 400,
  textAlign: "center",
  fontSize: 18,
}));

const UPDATE_INCOME = gql`
  mutation BudgetIncomeUpdate($year: Int!, $month: Int!, $income: Float!) {
    budgetIncomeUpdate(month: $month, year: $year, income: $income) {
      id
      income
    }
  }
`;

const GET_INCOME = gql`
  query GetBudgetIncome($year: Int!, $month: Int!) {
    budget(year: $year, month: $month) {
      id
      income
      month
      year
    }
  }
`;

interface Props {
  year: number;
  month: number;
}

const EditIncomeModal = ({ year, month }: Props) => {
  const [visible, setVisible] = useState(false);

  const { data } = useQuery<GetBudgetIncome, GetBudgetIncomeVariables>(
    GET_INCOME,
    {
      variables: { year, month },
    }
  );

  const [updateIncome] = useMutation<
    BudgetIncomeUpdate,
    BudgetIncomeUpdateVariables
  >(UPDATE_INCOME);

  const currentIncome =
    data && data.budget ? parseFloat(data.budget.income) : 0;

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setVisible(true);
        }}
      >
        <CashIcon />
      </TouchableOpacity>
      <MoneyInputModal
        defaultValue={(currentIncome * 100).toFixed()}
        title={
          <Text>
            <TitleText bold>{"Current Income\n"}</TitleText>
            <TitleText>{currencyf(currentIncome)}</TitleText>
          </Text>
        }
        visible={visible}
        onOk={(income: number) => {
          updateIncome({
            variables: {
              year,
              month,
              income,
            },
          })
            .then(() => {
              notice("Saved Monthly Income");
            })
            .finally(() => {
              setVisible(false);
            });
        }}
        onCancel={() => setVisible(false)}
      />
    </View>
  );
};

export default EditIncomeModal;
