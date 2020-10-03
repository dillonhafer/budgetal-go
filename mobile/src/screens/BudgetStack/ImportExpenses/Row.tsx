import { Ionicons } from "@expo/vector-icons";
import { currencyf } from "@shared/helpers";
import { colors } from "@shared/theme";
import gql from "graphql-tag";
import React, { useState } from "react";
import { useMutation } from "react-apollo";
import {
  ActivityIndicator,
  Picker,
  TouchableOpacity,
  View,
} from "react-native";
import styled from "styled-components/native";
import {
  BudgetItemExpenseUpsert,
  BudgetItemExpenseUpsertVariables,
} from "../BudgetItemExpenses/__generated__/BudgetItemExpenseUpsert";
import { BudgetCategory, BudgetItem, BudgetItemExpense } from "../types";

interface ImportExpense extends BudgetItemExpense {
  description: string;
}

const BUGET_ITEM_EXPENSE_UPSERT = gql`
  mutation BudgetItemExpenseUpsert(
    $budgetItemExpenseInput: BudgetItemExpenseInput!
  ) {
    budgetItemExpenseUpsert(budgetItemExpenseInput: $budgetItemExpenseInput) {
      id
      budgetItemId
      amount
      date
      name
    }
  }
`;

interface ImportProps {
  budgetItemId: number;
  name: string;
  amount: number;
  date: string;
  onSuccess(): void;
}

const ImportButton = ({
  budgetItemId,
  name,
  amount,
  date,
  onSuccess,
}: ImportProps) => {
  const [budgetItemExpenseUpsert, { loading }] = useMutation<
    BudgetItemExpenseUpsert,
    BudgetItemExpenseUpsertVariables
  >(BUGET_ITEM_EXPENSE_UPSERT, {
    variables: {
      budgetItemExpenseInput: {
        budgetItemId,
        name,
        amount,
        date,
      },
    },
  });

  const valid = budgetItemId > 0;
  const onSave = () => {
    budgetItemExpenseUpsert().then(() => onSuccess());
  };

  return (
    <TouchableOpacity onPress={onSave} disabled={!valid}>
      {loading && (
        <View
          style={{
            paddingRight: 20,
            paddingLeft: 20,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      {!loading && (
        <Ionicons
          name="ios-checkmark-circle-outline"
          size={48}
          color={colors.primary}
          style={{
            fontWeight: "300",
            paddingRight: 20,
            paddingLeft: 20,
            opacity: !valid ? 0.4 : 1,
          }}
        />
      )}
    </TouchableOpacity>
  );
};

const findFirstItemId = (categoryId: number, items: BudgetItem[]) => {
  return parseInt(
    (
      items.find(i => String(i.budgetCategoryId) === String(categoryId)) || {
        id: "",
      }
    ).id
  );
};

const DuplicateContainer = styled.View({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  padding: 5,
  borderRadius: 5,
  backgroundColor: colors.yellow,
  marginBottom: 20,
});

const TagText = styled.Text({
  textAlign: "center",
  color: "#fff",
  paddingRight: 5,
});

const AlertIcon = styled(Ionicons).attrs({ name: "ios-alert" })({
  marginHorizontal: 5,
  color: "#fff",
  fontSize: 22,
});

const CloseIcon = styled(Ionicons).attrs({
  name: "ios-close-circle-outline",
  size: 48,
  color: colors.error,
})({
  fontWeight: 300,
  paddingRight: 20,
  paddingLeft: 20,
});

const Container = styled.View<{ width: number }>(({ width }) => ({
  width,
  height: "100%",
  backgroundColor: "white",
  alignItems: "center",
  justifyContent: "space-between",
}));

const Description = styled.Text.attrs({
  adjustsFontSizeToFit: true,
  numberOfLines: 2,
})({
  textAlign: "center",
  color: "#AAA",
  fontSize: 16,
});

const Date = styled.Text({
  textAlign: "center",
  fontSize: 18,
});

const Amount = styled.Text({
  textAlign: "center",
  fontSize: 18,
  fontWeight: 700,
});

const InfoContainer = styled.View({
  padding: 10,
});

const ActionContainer = styled.View({
  width: "100%",
  marginVertical: 20,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
});

const Breadcrumb = styled.Text({
  fontSize: 22,
  fontWeight: 700,
  marginBottom: 10,
});

const OuterPicker = styled.View({
  flexDirection: "row",
  width: "100%",
  alignItems: "center",
  flex: 1,
});

const InnerPicker = styled.View({
  width: "100%",
  borderColor: colors.lines,
  borderRightColor: "transparent",
  borderLeftColor: "transparent",
  borderWidth: 0.5,
  flexDirection: "row",
  backgroundColor: "transparent",
});

interface Props {
  onNext(index: number): void;
  onFinished(): void;
  defaultBudgetItem: BudgetItem;
  index: number;
  item: ImportExpense;
  budgetItems: BudgetItem[];
  budgetItemExpenses: BudgetItemExpense[];
  total: number;
  width: number;
  budgetCategories: BudgetCategory[];
}

const ImportExpenseRow = ({
  budgetItemExpenses,
  budgetItems,
  item,
  onNext,
  onFinished,
  index,
  total,
  width,
  defaultBudgetItem,
  budgetCategories,
}: Props) => {
  const [budgetCategoryId, setBudgetCategoryId] = useState(
    parseInt(defaultBudgetItem.budgetCategoryId)
  );
  const [budgetItemId, setBudgetitemId] = useState(
    parseInt(defaultBudgetItem.id)
  );

  const possibleDuplicate = budgetItemExpenses.find(e => {
    return (
      e.name === item.description &&
      String(e.amount) === String(item.amount) &&
      e.date === item.date.format("YYYY-MM-DD")
    );
  });

  const lastExpense = index + 1 === total;

  return (
    <Container width={width}>
      <Breadcrumb>
        {index + 1} of {total} Expenses
      </Breadcrumb>
      <OuterPicker>
        <InnerPicker>
          <Picker
            style={{ width: "50%" }}
            selectedValue={String(budgetCategoryId)}
            onValueChange={itemValue => {
              const categoryId = parseInt(itemValue);
              const itemId = findFirstItemId(budgetCategoryId, budgetItems);
              setBudgetCategoryId(categoryId);
              setBudgetitemId(itemId);
            }}
          >
            {budgetCategories.map((c: BudgetCategory) => {
              return (
                <Picker.Item
                  key={c.id}
                  label={String(c.name)}
                  value={String(c.id)}
                />
              );
            })}
          </Picker>
          <Picker
            style={{ width: "50%" }}
            selectedValue={String(budgetItemId)}
            onValueChange={itemValue => setBudgetitemId(parseInt(itemValue))}
          >
            {budgetItems
              .filter(i => {
                return i.budgetCategoryId === String(budgetCategoryId);
              })
              .map(i => {
                return (
                  <Picker.Item
                    key={i.id}
                    label={String(i.name)}
                    value={String(i.id)}
                  />
                );
              })}
          </Picker>
        </InnerPicker>
      </OuterPicker>
      <InfoContainer>
        <Date>{item.date.format("dddd, MMM Do YYYY")}</Date>
        <Description>{item.description}</Description>
        <Amount>{currencyf(item.amount)}</Amount>
      </InfoContainer>
      <ActionContainer>
        <TouchableOpacity
          onPress={() => {
            if (lastExpense) {
              onFinished();
            } else {
              onNext(index);
            }
          }}
        >
          <CloseIcon />
        </TouchableOpacity>
        <ImportButton
          budgetItemId={budgetItemId}
          amount={parseFloat(item.amount)}
          name={item.description}
          date={item.date.format("YYYY-MM-DD")}
          onSuccess={() => {
            onNext(index);
          }}
        />
      </ActionContainer>
      {possibleDuplicate && (
        <DuplicateContainer>
          <AlertIcon />
          <TagText>Possible Duplicate</TagText>
        </DuplicateContainer>
      )}
    </Container>
  );
};

export default ImportExpenseRow;
