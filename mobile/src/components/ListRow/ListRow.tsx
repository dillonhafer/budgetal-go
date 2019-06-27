import { colors, dimensions, normalize } from "@shared/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { ReactElement } from "react";
import { StyleSheet, TouchableHighlight } from "react-native";
import styled from "styled-components/native";

interface RowProps {
  onPress?: (...args: any) => void;
  title?: string | ReactElement;
  subtitle?: string;
  leftComponent?: ReactElement;
  hideRightArrow?: boolean;
  rightComponent?: ReactElement;
  disabled?: boolean;
}

export const ListSeparator = styled.View({
  height: StyleSheet.hairlineWidth,
  backgroundColor: colors.lines,
});

const Container = styled.View({
  paddingHorizontal: dimensions.paddingHorizontal,
  paddingVertical: normalize(15),
  backgroundColor: "white",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
});

const LeftContainer = styled.View({
  marginRight: dimensions.paddingHorizontal,
});

const LeftItemContainer = styled.View({
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
});

const chevronHeight = normalize(26);
const ChevronRightIcon = styled(Ionicons).attrs({
  name: "ios-arrow-forward",
  size: chevronHeight,
  color: colors.lines,
})({});

const Title = styled.Text.attrs({
  numberOfLines: 1,
})({
  fontSize: 17,
  textAlign: "left",
  color: "#444",
});

const TitleContainer = styled.View({
  justifyContent: "center",
  flex: 1,
});

const ListRow = React.memo(
  ({
    onPress,
    leftComponent,
    title,
    hideRightArrow = false,
    disabled = false,
    rightComponent,
  }: RowProps) => {
    return (
      <TouchableHighlight
        disabled={disabled}
        underlayColor={colors.disabled}
        onPress={onPress}
      >
        <Container>
          <LeftItemContainer>
            {!!leftComponent && <LeftContainer>{leftComponent}</LeftContainer>}
            {!!title && (
              <TitleContainer>
                {title}
                {/* <Title>{title}</Title> */}
              </TitleContainer>
            )}
          </LeftItemContainer>
          {rightComponent || (!hideRightArrow && <ChevronRightIcon />)}
        </Container>
      </TouchableHighlight>
    );
  }
);

export default ListRow;
