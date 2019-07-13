import { notice } from "@src/notify";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationScreenConfigProps } from "react-navigation";
import Form from "./AssetLiabilityForm";
import { Asset } from "../types";

interface Props extends NavigationScreenConfigProps {}

const EditAssetLiabilityScreen = ({ navigation }: Props) => {
  const asset = navigation.getParam("item") as Asset;
  const title = asset.isAsset ? "ASSET" : "LIABILITY";

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Form
        asset={asset}
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

export default EditAssetLiabilityScreen;
