import InsetScrollView from "@src/components/InsetScrollView";
import { DangerButton } from "@src/forms";
import { notice } from "@src/notify";
import moment from "moment";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationScreenConfigProps } from "react-navigation";
import Form from "./Form";

interface Props extends NavigationScreenConfigProps {}

const NewAnnualBudgetItemScreen = ({ navigation }: Props) => {
  const annualBudgetId = navigation.getParam("annualBudgetId");
  const newItem = {
    id: null,
    name: "",
    amount: 0.0,
    dueDate: moment().format(),
    interval: 12,
    paid: false,
    annualBudgetId,
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <InsetScrollView>
        <Form
          item={newItem}
          afterSubmit={() => {
            notice("Item saved");
            navigation.goBack();
          }}
        />
        <DangerButton
          title="Cancel"
          onPress={() => {
            navigation.goBack();
          }}
        />
      </InsetScrollView>
    </>
  );
};

export default NewAnnualBudgetItemScreen;
