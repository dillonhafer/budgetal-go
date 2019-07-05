import React from "react";
import styled from "styled-components/native";
import { SecondaryButton } from "@src/forms";
import { BudgetCategory } from "../types";
import { confirm, notice } from "@src/notify";
import { monthName } from "@shared/helpers";

const importPreviousItems = (id: string) => {
  // importMutation({id}).then(() => {
  //   notice(resp.message);
  // })
};

const onImportPress = (budgetCategory: BudgetCategory) => {
  confirm({
    okText: `Copy ${budgetCategory.name}`,
    cancelText: "Cancel",
    title: "Copy Budget Items",
    content: `Do you want to copy budget items from your previous month's ${
      budgetCategory.name
    } category?`,
    onOk: () => importPreviousItems(budgetCategory.id),
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

  const onPress = () => onImportPress(budgetCategory);

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
