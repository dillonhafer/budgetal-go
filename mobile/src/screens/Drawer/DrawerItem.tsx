import { Ionicons } from "@expo/vector-icons";
import { colors } from "@shared/theme";
import { BudgetalText } from "@src/components/Text";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

const Label = styled(BudgetalText)({
  color: "#fff",
});

const Container = styled.View<{ active: boolean }>(({ active }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: active ? colors.drawerActive : colors.primary,
}));

const Icon = styled(Ionicons).attrs<{ name: string }>(({ name }) => ({
  name,
  size: 22,
  color: "#fff",
}))({
  alignItems: "center",
  width: 22,
  margin: 10,
  marginLeft: 20,
});

const IconContainer = styled.View({
  alignItems: "center",
  opacity: 0.62,
  width: 24,
  marginHorizontal: 16,
});

interface Props {
  iconName: string;
  label: string;
  onPress(): void;
  active?: boolean;
}

const DrawerItem = ({ iconName, label, onPress, active = false }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Container active={active}>
        <IconContainer>
          <Icon name={iconName} />
        </IconContainer>
        <View>
          <Label>{label}</Label>
        </View>
      </Container>
    </TouchableOpacity>
  );
};

export default React.memo(DrawerItem);
