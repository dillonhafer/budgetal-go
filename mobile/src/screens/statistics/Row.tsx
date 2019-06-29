import { currencyf } from "@shared/helpers";
import CategoryImage from "@src/components/CategoryImage";
import { Bold } from "@src/components/Text";
import React from "react";
import styled from "styled-components/native";
import { GetMonthlyStatistics_monthlyStatistic } from "./__generated__/GetMonthlyStatistics";

export interface Category extends GetMonthlyStatistics_monthlyStatistic {}

const rowPadding = 20;

const CurrencyRow = styled.View({
  marginLeft: rowPadding,
  flex: 1,
  justifyContent: "center",
});

const BoldText = styled(Bold)({
  color: "#444",
  fontSize: 18,
  marginBottom: 5,
});

const Container = styled.View({
  padding: rowPadding,
  justifyContent: "center",
  flexDirection: "row",
});

const Row = ({ category }: { category: Category }) => (
  <Container>
    <CategoryImage name={category.name} />
    <CurrencyRow>
      <BoldText>{category.name}</BoldText>
      <BoldText>
        {currencyf(category.amountSpent)} - {category.percentSpent}%
      </BoldText>
    </CurrencyRow>
  </Container>
);

export default Row;
