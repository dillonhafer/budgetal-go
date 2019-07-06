import { notice } from "@src/notify";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationScreenConfigProps } from "react-navigation";
import Form from "./Form";

interface Props extends NavigationScreenConfigProps {}

const EditBudgetItemScreen = ({ navigation }: Props) => {
  const budgetItem = navigation.getParam("budgetItem");
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Form
        item={budgetItem}
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

export default EditBudgetItemScreen;
