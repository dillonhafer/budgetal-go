import { Ionicons } from "@expo/vector-icons";
import { colors } from "@shared/theme";
import { Bold } from "@src/components/Text";
import { range } from "lodash";
import moment from "moment";
import React, { useState } from "react";
import { LayoutAnimation, Picker, StyleSheet } from "react-native";
import styled from "styled-components/native";

const months = moment
  .months()
  .map((m, i) => <Picker.Item key={m} label={m} value={String(i + 1)} />);

const years = range(2015, new Date().getFullYear() + 3).map(y => (
  <Picker.Item key={y} label={String(y)} value={String(y)} />
));

const Container = styled.View({
  backgroundColor: "#fff",
  paddingTop: 10,
});

const PickerContainer = styled.View({
  flexDirection: "row",
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.primary,
  borderLeftWidth: 0,
  borderRightWidth: 0,
});

const DateLabel = styled(Bold)({
  fontSize: 18,
  textAlign: "left",
  color: "#444",
});

const ToggleButton = styled.TouchableOpacity<{ showPicker: boolean }>(
  props => ({
    borderWidth: 0,
    borderColor: "#fff",
    minHeight: 40,
    marginTop: 10,
    marginHorizontal: 20,
    borderBottomColor: props.showPicker ? "transparent" : colors.primary,
    borderBottomWidth: 2,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  })
);

interface Props {
  month?: number | string;
  year?: number | string;
  onChange({ year, month }: { year: number; month: number }): void;
}

const DatePicker = ({
  month: initialMonth,
  year: initialYear,
  onChange,
}: Props) => {
  const [month, setMonth] = useState(String(initialMonth) || "1");
  const [year, setYear] = useState(String(initialYear) || "2019");
  const [showPicker, setShowPicker] = useState(false);
  const toggle = () => {
    LayoutAnimation.easeInEaseOut();
    setShowPicker(!showPicker);
  };

  let date = moment(`${year}-${month}`, "YYYY-MM");
  let yearWidth = "40%";
  let monthWidth = "60%";
  let format = "MMMM YYYY";

  if (!initialMonth) {
    date = moment(`${year}-1`, "YYYY-MM");
    yearWidth = "100%";
    monthWidth = "0%";
    format = "YYYY";
  }

  const onValueChange = ({
    year: newYear,
    month: newMonth,
  }: {
    year: string;
    month: string;
  }) => {
    LayoutAnimation.easeInEaseOut();
    setMonth(newMonth);
    setYear(newYear);
    setShowPicker(false);
    onChange({ month: parseInt(newMonth), year: parseInt(newYear) });
  };

  const iconName = showPicker
    ? "ios-close-circle-outline"
    : "ios-arrow-dropdown";

  return (
    <Container>
      <ToggleButton showPicker={showPicker} onPress={toggle}>
        <DateLabel>{date.format(format)}</DateLabel>
        <Ionicons
          name={iconName}
          color={showPicker ? colors.lines : colors.primary}
          size={26}
        />
      </ToggleButton>
      {showPicker && (
        <PickerContainer>
          <Picker
            style={{ width: monthWidth }}
            itemStyle={{ fontFamily: "System" }}
            selectedValue={`${month}`}
            onValueChange={month =>
              onValueChange({ month, year: String(year) })
            }
          >
            {months}
          </Picker>
          <Picker
            style={{ width: yearWidth }}
            selectedValue={`${year}`}
            itemStyle={{ fontFamily: "System" }}
            onValueChange={year =>
              onValueChange({ year, month: String(month) })
            }
          >
            {years}
          </Picker>
        </PickerContainer>
      )}
    </Container>
  );
};

export default React.memo(DatePicker);
