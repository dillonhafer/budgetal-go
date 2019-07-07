import RNDropdownAlert from "react-native-dropdownalert";
import React, { useState, useRef } from "react";
import { colors } from "@shared/theme";
import { Platform } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const successColor = colors.success + "f9";
const errorColor = colors.error + "f9";
const maintenanceStyle = { backgroundColor: "purple" };

const icons = {
  info: "ios-information-circle-outline",
  error: "ios-alert",
  success: "ios-checkmark-circle-outline",
  custom: "ios-construct",
};

const IconContainer = styled.View({
  alignItems: "center",
  justifyContent: "center",
  marginTop: Platform.OS === "ios" ? 0 : 20,
});

interface Options {
  delay?: number;
}

const DropdownAlert = () => {
  const [delay, setDelay] = useState(1000);
  const dropdown = useRef<RNDropdownAlert>(null);

  const renderImage = () => {
    if (!dropdown.current) {
      return null;
    }

    const name = icons[dropdown.current.state.type];
    return (
      <IconContainer>
        <Ionicons name={name} size={32} color={"#fff"} />
      </IconContainer>
    );
  };

  global.alertWithType = (
    type: "success",
    title: string,
    message: string,
    options: Options = {}
  ) => {
    const originalDelay = delay;
    if (options.delay) {
      setDelay(options.delay);
    }

    dropdown.current.alertWithType(type, title, message);

    if (options.delay) {
      setTimeout(() => {
        setDelay(originalDelay);
      }, options.delay);
    }
  };

  return (
    <RNDropdownAlert
      closeInterval={delay}
      renderImage={renderImage}
      successColor={successColor}
      errorColor={errorColor}
      containerStyle={maintenanceStyle}
      ref={dropdown}
    />
  );
};

export default DropdownAlert;
