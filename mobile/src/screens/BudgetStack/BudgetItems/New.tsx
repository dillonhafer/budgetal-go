import { notice } from "@src/notify";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationScreenConfigProps } from "react-navigation";
import Form from "./Form";

interface Props extends NavigationScreenConfigProps {}

const NewBudgetItemScreen = ({ navigation }: Props) => {
  const budgetCategoryId = navigation.getParam("budgetCategoryId");
  const newItem = {
    id: null,
    name: "",
    amount: 0.0,
    budgetCategoryId,
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Form
        item={newItem}
        afterSubmit={() => {
          notice("Item saved");
          navigation.goBack();
        }}
        onCancel={() => {
          navigation.goBack();
        }}
      />
    </>
  );
};

export default NewBudgetItemScreen;
