import { notice } from "@src/notify";
import moment from "moment";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationScreenConfigProps } from "react-navigation";
import Form from "./Form";

interface Props extends NavigationScreenConfigProps {}

const NewBudgetItemExpenseScreen = ({ navigation }: Props) => {
  const budgetItemId = navigation.getParam("budgetItemId");
  const newExpense = {
    id: null,
    name: "",
    amount: 0.0,
    date: moment().format(),
    budgetItemId,
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Form
        expense={newExpense}
        afterSubmit={() => {
          notice("Expense saved");
          navigation.goBack();
        }}
        onCancel={() => {
          navigation.goBack();
        }}
      />
    </>
  );
};

export default NewBudgetItemExpenseScreen;
