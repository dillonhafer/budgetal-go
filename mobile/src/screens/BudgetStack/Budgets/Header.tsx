import Card, { SplitBackground } from "@src/components/Card";
import DatePicker from "@src/utils/DatePicker";
import React from "react";

interface Props {
  onChange({ month, year }: { month: number; year: number }): void;
  budget: any;
  amountBudgeted: number;
  amountSpent: number;
  remaining: number;
}

const Header = ({
  onChange,
  budget,
  amountBudgeted,
  amountSpent,
  remaining,
}: Props) => (
  <>
    <DatePicker month={budget.month} year={budget.year} onChange={onChange} />
    <SplitBackground>
      <Card
        label="Budgeted"
        budgeted={amountBudgeted}
        spent={amountSpent}
        remaining={remaining}
      />
    </SplitBackground>
  </>
);

export default Header;
