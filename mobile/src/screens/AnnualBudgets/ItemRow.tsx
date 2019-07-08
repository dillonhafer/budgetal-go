import { MaterialCommunityIcons } from "@expo/vector-icons";
import { currencyf } from "@shared/helpers";
import { colors } from "@shared/theme";
import ListRow from "@src/components/ListRow";
import { Bold, LightText, Medium } from "@src/components/Text";
import { confirm, notice } from "@src/notify";
import { round } from "lodash";
import moment from "moment";
import React from "react";
import { View } from "react-native";
import Swipeout from "react-native-swipeout";
import styled from "styled-components/native";
import { GetAnnualBudget_annualBudget_annualBudgetItems } from "./__generated__/GetAnnualBudget";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import isEqual from "fast-deep-equal";

const ANNUAL_BUDGET_ITEM_DELETE = gql`
  mutation AnnualBudgetItemDelete($id: ID!) {
    annualBudgetItemDelete(id: $id) {
      id
    }
  }
`;

const ButtonContainer = styled.View({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
});

const createButtons = ({
  onEdit,
  onDelete,
}: {
  onEdit(): void;
  onDelete(): void;
}) => {
  return [
    {
      component: (
        <ButtonContainer>
          <MaterialCommunityIcons name="pencil" color={"#fff"} size={20} />
        </ButtonContainer>
      ),
      backgroundColor: colors.primary,
      underlayColor: colors.primary + "70",
      onPress: onEdit,
    },
    {
      component: (
        <ButtonContainer>
          <MaterialCommunityIcons name="delete" color={"#fff"} size={20} />
        </ButtonContainer>
      ),
      backgroundColor: colors.error,
      underlayColor: colors.error + "70",
      onPress: onDelete,
    },
  ];
};

const TitleContainer = styled.View({
  flex: 1,
  backgroundColor: "white",
  alignItems: "center",
  justifyContent: "center",
});

const CenterBold = styled(Bold)({
  textAlign: "center",
});

const Center = styled(Medium)({
  textAlign: "center",
});

const Name = styled(Bold)({
  textAlign: "center",
  fontSize: 20,
  marginBottom: 10,
});

const Tag = styled.View<{ color: string }>(props => ({
  backgroundColor: props.color,
  marginTop: 10,
  padding: 5,
  borderRadius: 5,
  width: 50,
}));

const TagText = styled(LightText)({
  textAlign: "center",
  color: "#fff",
});

const Title = ({
  budgetItem,
}: {
  budgetItem: GetAnnualBudget_annualBudget_annualBudgetItems;
}) => {
  const color = budgetItem.paid ? colors.success : colors.disabled;
  return (
    <TitleContainer>
      <View>
        <Name>{budgetItem.name}</Name>
        <Center>
          In order to reach{" "}
          <CenterBold>{currencyf(budgetItem.amount)}</CenterBold>
        </Center>
        <Center>
          by <CenterBold>{moment(budgetItem.dueDate).format("LL")}</CenterBold>
        </Center>
        <Center>you need to save</Center>
        <CenterBold>
          {currencyf(
            round(parseFloat(budgetItem.amount) / budgetItem.interval)
          )}
          /month
        </CenterBold>
      </View>
      <Tag color={color}>
        <TagText>Paid</TagText>
      </Tag>
    </TitleContainer>
  );
};

interface Props {
  navigate(route: string, params?: object): void;
  budgetItem: GetAnnualBudget_annualBudget_annualBudgetItems;
}

const ItemRow = ({ budgetItem, navigate }: Props) => {
  const [deleteItem] = useMutation(ANNUAL_BUDGET_ITEM_DELETE, {
    variables: { id: budgetItem.id },
    refetchQueries: ["GetAnnualBudget"],
  });

  const showProgress = () =>
    navigate("AnnualBudgetProgress", {
      budgetItem,
    });

  const buttons = createButtons({
    onEdit: () => {
      navigate("EditAnnualBudgetItem", {
        annualBudgetItem: budgetItem,
      });
    },
    onDelete: () => {
      confirm({
        title: `Delete ${budgetItem.name}?`,
        okText: "Delete",
        onOk: () => {
          deleteItem();
          notice(`${budgetItem.name} Deleted`);
        },
      });
    },
  });

  return (
    <Swipeout
      autoClose={true}
      backgroundColor={buttons[0].backgroundColor}
      right={buttons}
    >
      <ListRow
        onPress={showProgress}
        hideRightArrow
        title={<Title budgetItem={budgetItem} />}
      />
    </Swipeout>
  );
};

const shouldSkipUpdate = (prev: Props, next: Props) => {
  return isEqual(prev.budgetItem, next.budgetItem);
};

export default React.memo(ItemRow, shouldSkipUpdate);
