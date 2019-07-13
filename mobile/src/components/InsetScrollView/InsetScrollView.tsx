import { BlurViewInsetProps } from "@src/utils/navigation-helpers";
import { StyleSheet } from "react-native";
import styled from "styled-components/native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ececec",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: 40,
    paddingTop: 15,
  },
});

const InsetScrollView = styled.ScrollView.attrs({
  ...BlurViewInsetProps,
  keyboardDismissMode: "on-drag",
  keyboardShouldPersistTaps: "handled",
  contentInsetAdjustmentBehavior: "automatic",
  contentContainerStyle: styles.container,
})({});

export default InsetScrollView;
