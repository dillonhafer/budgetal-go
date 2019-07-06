import { notice } from "@src/notify";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationScreenConfigProps } from "react-navigation";
import Form from "./Form";

interface Props extends NavigationScreenConfigProps {}

const EditBudgetItemExpenseScreen = ({ navigation }: Props) => {
  const expense = navigation.getParam("budgetItemExpense");

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Form
        expense={expense}
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

export default EditBudgetItemExpenseScreen;
