import { useQuery } from "react-apollo";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "@shared/theme";
import { ListSeparator } from "@src/components/ListRow";
import { Bold } from "@src/components/Text";
import DatePicker from "@src/utils/DatePicker";
import { BlurViewInsetProps } from "@src/utils/navigation-helpers";
import Spin from "@src/utils/Spin";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StatusBar } from "react-native";
import styled from "styled-components/native";
import Row, { Category } from "./Row";

const GET_MONTHLY_STATISTICS = gql`
  query GetMonthlyStatistics($year: Int!, $month: Int!) {
    monthlyStatistic(year: $year, month: $month) {
      amountSpent
      totalSpent
      percentSpent
      id
      month
      name
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
const defaultMonth = parseInt(`${new Date().getMonth() + 1}`);

interface PickerProps {
  year: number;
  month: number;
}

const Container = styled.View({
  flex: 1,
  backgroundColor: "#fff",
});

const Empty = () => (
  <MissingContainer>
    <FontAwesome name="money" size={32} color={colors.success} />
    <MissingText>There aren't any items yet</MissingText>
  </MissingContainer>
);

const StatisticsScreen = () => {
  const [year, setYear] = useState(defaultYear);
  const [month, setMonth] = useState(defaultMonth);
  const [refreshing, setRefreshing] = useState(false);
  const { loading, data, refetch } = useQuery(GET_MONTHLY_STATISTICS, {
    variables: { year, month },
  });
  const { monthlyStatistic = [] } = data;

  useEffect(() => {
    if (refreshing) {
      refetch({ year, month });
      setRefreshing(false);
    }
  }, [year, refreshing]);

  const onDateChange = ({ month, year }: PickerProps) => {
    setMonth(month);
    setYear(year);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Container>
        <FlatList
          {...BlurViewInsetProps}
          contentInsetAdjustmentBehavior="automatic"
          ListHeaderComponent={
            <DatePicker year={year} month={month} onChange={onDateChange} />
          }
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
          keyExtractor={(i: Category) => i.id}
          data={monthlyStatistic}
          ItemSeparatorComponent={ListSeparator}
          renderItem={({ item }: { item: Category }) => <Row category={item} />}
        />
        <Spin spinning={loading && !refreshing} />
      </Container>
    </>
  );
};

StatisticsScreen.navigationOptions = {
  title: "Statistics",
};

export default StatisticsScreen;
