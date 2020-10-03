import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@shared/theme";
import { BlurViewInsetProps } from "@src/utils/navigation-helpers";
import React from "react";
import { SectionList, StatusBar } from "react-native";
import { NavigationScreenConfigProps } from "react-navigation";
import styled from "styled-components/native";
import Header from "./Header";

const Container = styled.View({
  flex: 1,
  backgroundColor: colors.background,
});

const SeparatorContainer = styled.View({
  backgroundColor: "white",
});

const SeparatorLine = styled.View({
  height: 1,
  marginLeft: 62,
  width: "100%",
  backgroundColor: colors.lines,
});

const Separator = () => (
  <SeparatorContainer>
    <SeparatorLine />
  </SeparatorContainer>
);

const HeaderText = styled.Text({
  marginTop: 15,
  padding: 5,
  paddingLeft: 15,
  fontSize: 12,
  color: colors.sectionHeader,
  fontWeight: 400,
});

const LeftContainer = styled.View({
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
});

const LeftItem = styled.View({
  alignItems: "center",
  justifyContent: "center",
  marginHorizontal: 15,
  paddingVertical: 5,
});

const IconContainer = styled.View({
  width: 30,
  height: 30,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.primary,
  borderColor: "transparent",
  borderWidth: 1,
  borderRadius: 6,
});

const Label = styled.Text({
  fontSize: 17,
  textAlign: "left",
  color: "#444",
});

const ButtonRow = styled.TouchableHighlight.attrs({
  underlayColor: "#eee",
})<{ position: "first" | "last" }>(({ position }) => ({
  backgroundColor: "#fff",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderTopWidth: position === "first" ? 1 : 0,
  borderBottomWidth: position === "last" ? 1 : 0,
  borderColor: colors.lines,
  borderBottomColor: "transparent",
}));

interface Item {
  icon: string;
  key: string;
  onPress(): void;
  position: "first" | "last";
}

const Row = ({ item }: { item: Item }) => (
  <ButtonRow position={item.position} onPress={item.onPress}>
    <>
      <LeftContainer>
        <LeftItem>
          <IconContainer>
            <MaterialCommunityIcons name={item.icon} size={22} color={"#fff"} />
          </IconContainer>
        </LeftItem>
        <Label>{item.key}</Label>
      </LeftContainer>
      <Ionicons
        name="ios-arrow-forward"
        size={22}
        style={{ paddingRight: 15 }}
        color={"#ced0ce"}
      />
    </>
  </ButtonRow>
);

interface Props extends NavigationScreenConfigProps {}
const AccountScreen = ({ navigation }: Props) => {
  const buttons = [
    {
      title: "ACCOUNT",
      data: [
        {
          key: "Sessions",
          icon: "folder-lock-open",
          onPress: () => {
            navigation.navigate("Sessions");
          },
          position: "first",
        },
        {
          key: "Change Password",
          icon: "account-key",
          onPress: () => {
            navigation.navigate("ChangePassword");
          },
          position: "last",
        },
      ],
    },
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Container>
        <SectionList
          {...BlurViewInsetProps}
          contentInsetAdjustmentBehavior="automatic"
          ListHeaderComponent={() => {
            return (
              <Header
                onPress={() => {
                  navigation.navigate("AccountEdit");
                }}
              />
            );
          }}
          stickySectionHeadersEnabled={false}
          sections={buttons}
          ItemSeparatorComponent={Separator}
          renderSectionHeader={({ section }) => (
            <HeaderText>{section.title}</HeaderText>
          )}
          renderItem={({ item }: { item: Item }) => <Row item={item} />}
        />
      </Container>
    </>
  );
};

export default React.memo(AccountScreen, () => true);
