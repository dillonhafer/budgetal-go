import { colors } from "@shared/theme";
import { BlurViewInsetProps } from "@src/utils/navigation-helpers";
import React, { Component, useState } from "react";
import { StatusBar } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styled from "styled-components/native";
import AccountForm from "./AccountForm";
import ImagePicker from "./ImagePicker";
import { NavigationScreenConfigProps } from "react-navigation";

const Container = styled.View({
  flex: 1,
  backgroundColor: colors.backgroundColor,
});

interface Props extends NavigationScreenConfigProps {}

const AccountEditScreen = ({ navigation }: Props) => {
  const [image, setImage] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const hidePicker = () => {
    StatusBar.setBarStyle("dark-content", true);
    setShowImagePicker(false);
  };

  const showPicker = () => {
    StatusBar.setBarStyle("light-content", true);
    setShowImagePicker(true);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Container>
        <KeyboardAwareScrollView
          {...BlurViewInsetProps}
          contentInsetAdjustmentBehavior="automatic"
        >
          <ImagePicker
            visible={showImagePicker}
            onChange={result => {
              if (!result.cancelled) {
                setImage(result.uri);
                hidePicker();
              } else {
                showPicker();
              }
            }}
            onCancel={hidePicker}
          />

          <AccountForm
            image={image}
            onProfilePress={showPicker}
            afterSubmit={() => {
              navigation.goBack();
            }}
          />
        </KeyboardAwareScrollView>
      </Container>
    </>
  );
};

export default AccountEditScreen;
