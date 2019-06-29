import { useQuery } from "@apollo/react-hooks";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "@shared/theme";
import { Bold } from "@src/components/Text";
import DatePicker from "@src/utils/DatePicker";
import { BlurViewInsetProps } from "@src/utils/navigation-helpers";
import PlusButton from "@src/utils/PlusButton";
import Spin from "@src/utils/Spin";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StatusBar } from "react-native";
import {
  NavigationScreenConfigProps,
  NavigationScreenProps,
} from "react-navigation";
import styled from "styled-components/native";
import ItemRow from "./ItemRow";
import { ListSeparator } from "@src/components/ListRow";
import { GetAnnualBudget_annualBudget_annualBudgetItems } from "./__generated__/GetAnnualBudget";

interface Item extends GetAnnualBudget_annualBudget_annualBudgetItems {}

const GET_ANNUAL_BUDGET = gql`
  query GetAnnualBudget($year: Int!) {
    annualBudget(year: $year) {
      annualBudgetItems {
        id
        annualBudgetId
        name
        dueDate
        amount
        interval
        paid
      }
      id
      year
    }
  }
`;

const MissingContainer = styled.View({
  padding: 20,
  paddingTop: 40,
  alignItems: "center",
});

const MissingText = styled(Bold)({
  margin: 5,
  textAlign: "center",
});

const defaultYear = parseInt(`${new Date().getFullYear()}`);

interface HeaderProps {
  year: number;
  setYear(year: number): void;
}

const Container = styled.View({
  flex: 1,
  backgroundColor: "#fff",
});

const Header = ({ year, setYear }: HeaderProps) => {
  return (
    <DatePicker
      year={year}
      onChange={({ year }) => {
        setYear(year);
      }}
    />
  );
};

const Empty = () => (
  <MissingContainer>
    <FontAwesome name="money" size={32} color={colors.success} />
    <MissingText>There aren't any items yet</MissingText>
  </MissingContainer>
);

interface Props extends NavigationScreenConfigProps {}

const AnnualBudgetScreen = ({ navigation }: Props) => {
  const [year, setYear] = useState(defaultYear);
  const [refreshing, setRefreshing] = useState(false);
  const { loading, data, refetch } = useQuery(GET_ANNUAL_BUDGET, {
    variables: { year },
  });

  const { annualBudget } = data;

  const items =
    annualBudget && annualBudget.annualBudgetItems
      ? annualBudget.annualBudgetItems
      : [];

  useEffect(() => {
    if (annualBudget) {
      navigation.setParams({ annualBudgetId: annualBudget.id });
    }
  }, [annualBudget]);

  useEffect(() => {
    if (refreshing) {
      refetch({ year });
      setRefreshing(false);
    }
  }, [year, refreshing]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Container>
        <FlatList
          {...BlurViewInsetProps}
          contentInsetAdjustmentBehavior="automatic"
          ListHeaderComponent={<Header year={year} setYear={setYear} />}
          ListEmptyComponent={<Empty />}
          refreshControl={
            <RefreshControl
              tintColor={"lightskyblue"}
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
              }}
            />
          }
          keyExtractor={(i: Item) => i.id}
          data={items}
          ItemSeparatorComponent={ListSeparator}
          renderItem={({ item }: { item: Item }) => (
            <ItemRow budgetItem={item} navigate={navigation.navigate} />
          )}
        />
        <Spin spinning={loading} />
      </Container>
    </>
  );
};

AnnualBudgetScreen.navigationOptions = ({
  navigation,
}: NavigationScreenProps<any>) => {
  const annualBudgetId = navigation.getParam("annualBudgetId");
  const onPress = () => {
    navigation.navigate("NewAnnualBudgetItem", {
      annualBudgetId,
    });
  };

  return {
    headerRight: <PlusButton onPress={onPress} />,
  };
};

export default AnnualBudgetScreen;
