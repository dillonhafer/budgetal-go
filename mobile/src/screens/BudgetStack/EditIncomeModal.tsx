import { Ionicons } from "@expo/vector-icons";
import { UpdateIncomeRequest } from "@shared/api/budgets";
import { currencyf } from "@shared/helpers";
import { updateIncome } from "@src/actions/budgets";
import MoneyInputModal from "@src/forms/MoneyInputModal";
import { error, notice } from "@src/notify";
import React, { Component } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";

type Budget = {
  year: number;
  month: number;
  income: number;
};

interface Props {
  budget: Budget;
  updateIncome(income: number): void;
}

class EditIncomeModal extends Component<Props> {
  state = {
    loading: false,
    visible: false,
    income: "0",
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  hideModal = () => {
    this.setState({ visible: false, income: "0" });
  };

  handleSubmit = async (income: number) => {
    this.setState({ loading: true });
    try {
      const { year, month } = this.props.budget;
      const resp = await UpdateIncomeRequest({ year, month, income });
      if (resp && resp.ok) {
        this.props.updateIncome(income);
        this.hideModal();
        notice("Saved Monthly Income");
      }
    } catch (err) {
      error("Could not update monthly income");
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { visible } = this.state;
    const { budget } = this.props;

    return (
      <View>
        <TouchableOpacity onPress={this.showModal}>
          <Ionicons
            name="ios-cash"
            size={30}
            color={"#037aff"}
            style={{
              paddingRight: 15,
            }}
          />
        </TouchableOpacity>
        <MoneyInputModal
          defaultValue={(budget.income * 100).toFixed()}
          title={
            <Text>
              <Text
                style={{ textAlign: "center", fontSize: 18, fontWeight: "700" }}
              >
                Current Income
                {"\n"}
              </Text>
              <Text style={{ textAlign: "center", fontSize: 18 }}>
                {currencyf(budget.income)}
              </Text>
            </Text>
          }
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
        />
      </View>
    );
  }
}

export default connect(
  (state: any) => ({
    budget: state.budget.budget,
  }),
  (dispatch: any) => ({
    updateIncome: (income: string) => {
      dispatch(updateIncome(income));
    },
  })
)(EditIncomeModal);
