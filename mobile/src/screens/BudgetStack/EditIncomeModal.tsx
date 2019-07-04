import { Ionicons } from "@expo/vector-icons";
import { UpdateIncomeRequest } from "@shared/api/budgets";
import { currencyf } from "@shared/helpers";
import MoneyInputModal from "@src/forms/MoneyInputModal";
import { notice } from "@src/notify";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useQuery } from "react-apollo";
import { GetBudgets, GetBudgetsVariables } from "./__generated__/GetBudgets";

const GET_INCOME = gql`
  query GetBudgets($year: Int!, $month: Int!) {
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

  const { data } = useQuery<GetBudgets, GetBudgetsVariables>(GET_INCOME, {
    variables: { year, month },
  });

  const income = data && data.budget ? parseFloat(data.budget.income) : 0;

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setVisible(true);
        }}
      >
        <Ionicons
          name="ios-cash"
          size={30}
          color={"#037aff"}
          style={{
            paddingRight: 15,
          }}
        />
      </TouchableOpacity>
      <MoneyInputModal
        defaultValue={(income * 100).toFixed()}
        title={
          <Text>
            <Text
              style={{ textAlign: "center", fontSize: 18, fontWeight: "700" }}
            >
              {"Current Income\n"}
            </Text>
            <Text style={{ textAlign: "center", fontSize: 18 }}>
              {currencyf(income)}
            </Text>
          </Text>
        }
        visible={visible}
        onOk={async (income: number) => {
          const resp = await UpdateIncomeRequest({ year, month, income });
          if (resp && resp.ok) {
            // this.props.updateIncome(income);
            setVisible(false);
            notice("Saved Monthly Income");
          }
        }}
        onCancel={() => setVisible(false)}
      />
    </View>
  );
};

export default EditIncomeModal;
