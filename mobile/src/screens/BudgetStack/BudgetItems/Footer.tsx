import React from "react";
import styled from "styled-components/native";
import { SecondaryButton } from "@src/forms";
import { BudgetCategory } from "../types";
import { confirm, notice } from "@src/notify";
import { monthName } from "@shared/helpers";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";
import {
  BudgetCategoryImport,
  BudgetCategoryImportVariables,
} from "./__generated__/BudgetCategoryImport";

const IMPORT_CATEGORIES = gql`
  mutation BudgetCategoryImport($id: ID!) {
    budgetCategoryImport(id: $id) {
      message
    }
  }
`;

const onImportPress = (budgetCategory: BudgetCategory, onOk: () => void) => {
  confirm({
    okText: `Copy ${budgetCategory.name}`,
    cancelText: "Cancel",
    title: "Copy Budget Items",
    content: `Do you want to copy budget items from your previous month's ${
      budgetCategory.name
    } category?`,
    onOk,
  });
};

const FooterContainer = styled.View({
  paddingBottom: 30,
});
interface Props {
  month: number;
  budgetCategory: BudgetCategory;
}

const Footer = ({ budgetCategory, month }: Props) => {
  const previousMonthDigit = month === 1 ? 12 : month - 1;
  const previousMonth = monthName(previousMonthDigit - 1);

  const [budgetCategoryImport] = useMutation<
    BudgetCategoryImport,
    BudgetCategoryImportVariables
  >(IMPORT_CATEGORIES, {
    variables: { id: budgetCategory.id },
    refetchQueries: ["GetBudgets"],
    onCompleted: data => {
      if (data) {
        notice(data.budgetCategoryImport.message);
      }
    },
  });

  const onPress = () => onImportPress(budgetCategory, budgetCategoryImport);

  return (
    <FooterContainer>
      <SecondaryButton
        title={`Copy ${previousMonth} Items`}
        onPress={onPress}
      />
    </FooterContainer>
  );
};

export default Footer;
