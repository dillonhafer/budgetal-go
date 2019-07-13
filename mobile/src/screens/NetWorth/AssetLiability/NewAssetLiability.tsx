import { notice } from "@src/notify";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationScreenConfigProps } from "react-navigation";
import Form from "./AssetLiabilityForm";

interface Props extends NavigationScreenConfigProps {}

const NewAssetLiabilityScreen = ({ navigation }: Props) => {
  const title = navigation.getParam("title");
  const newAsset = {
    name: "",
    isAsset: title === "ASSET",
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Form
        asset={newAsset}
        afterSubmit={() => {
          notice(`${title} SAVED`);
          navigation.goBack();
        }}
        onCancel={() => {
          navigation.goBack();
        }}
      />
    </>
  );
};

export default NewAssetLiabilityScreen;
