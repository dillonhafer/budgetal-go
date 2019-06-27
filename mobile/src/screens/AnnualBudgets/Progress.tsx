import { MaterialCommunityIcons } from "@expo/vector-icons";
import { currencyf } from "@shared/helpers";
import { colors } from "@shared/theme";
import { ListSeparator } from "@src/components/ListRow";
import { Bold, Medium } from "@src/components/Text";
import { BlurViewInsetProps } from "@src/utils/navigation-helpers";
import { round, times } from "lodash";
import moment from "moment";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { NavigationScreenConfigProps } from "react-navigation";
import styled from "styled-components/native";

const screenPadding = 15;

const SeparatorContainer = styled.View({
  paddingHorizontal: screenPadding,
});

const Separator = () => (
  <SeparatorContainer>
    <ListSeparator />
  </SeparatorContainer>
);

interface Item {
  key: string;
  icon: string;
  color: string;
  date: string;
  amount: number;
}

const Container = styled.View({
  marginHorizontal: screenPadding,
  paddingVertical: screenPadding,
  alignSelf: "stretch",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
});

const DateRow = styled.View({
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
});

const Date = styled(Medium)({
  fontSize: 18,
  fontWeight: 500,
});

const Amount = styled(Bold)({
  fontSize: 16,
});

const ProgressRow = ({ item }: { item: Item }) => {
  return (
    <Container>
      <DateRow>
        <MaterialCommunityIcons
          name={item.icon}
          color={item.color}
          size={22}
          style={{ marginRight: 5 }}
        />
        <Date>{item.date}</Date>
      </DateRow>
      <Amount>{currencyf(item.amount)}</Amount>
    </Container>
  );
};

const HeaderContainer = styled.View({
  padding: 10,
  alignItems: "center",
});

const HeaderText = styled(Bold)({
  color: "#444",
  fontSize: 18,
});

const Header = ({ name = "" }) => (
  <HeaderContainer>
    <HeaderText>Accumulation Progress for</HeaderText>
    <HeaderText>{name}</HeaderText>
  </HeaderContainer>
);

interface Props extends NavigationScreenConfigProps {}

const Progress = ({ navigation }: Props) => {
  const item = navigation.getParam("budgetItem");
  const startDate = moment(item.dueDate).subtract(item.interval + 1, "months");
  const monthlyAmount = round(item.amount / item.interval);
  const data = times<Item>(
    item.interval,
    (key): Item => {
      const date = startDate.add(1, "months").format("LL");
      const success = moment().diff(startDate) > 0;
      const icon = success ? "check-circle" : "close-circle";
      const color = success ? colors.success : colors.error;
      const amount = monthlyAmount * (key + 1);

      return {
        key: String(key),
        date,
        icon,
        color,
        amount,
      };
    }
  );

  return (
    <View style={styles.container}>
      <FlatList
        {...BlurViewInsetProps}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.list}
        contentContainerStyle={styles.listContainer}
        data={data}
        renderItem={({ item }: { item: Item }) => <ProgressRow item={item} />}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={() => <Header name={item.name} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  list: {
    width: "100%",
  },
  listContainer: {
    backgroundColor: "#fff",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 5,
    margin: 0,
  },
  listSeparatorContainer: {
    backgroundColor: "#fff",
  },
  listSeparator: {
    height: 1,
    flex: 1,
    marginHorizontal: 15,
    backgroundColor: colors.lines,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  date: {
    fontSize: 18,
    fontWeight: "500",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
  },
  row: {
    marginHorizontal: 15,
    paddingVertical: 15,
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    color: "#444",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default Progress;
