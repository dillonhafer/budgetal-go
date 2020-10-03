import CsvUploadButton from "@src/components/CsvUploadButton";
import { error } from "@src/notify";
import * as DocumentPicker from "expo-document-picker";
import moment from "moment";
import Papa from "papaparse";
import React, { PureComponent } from "react";
import { useQuery } from "react-apollo";
import { FlatList, StatusBar, View, WebView } from "react-native";
import { NavigationScreenConfigProps } from "react-navigation";
import styled from "styled-components/native";
import { GET_BUDGET } from "../Budgets/Budgets";
import {
  GetBudgets,
  GetBudgetsVariables,
} from "../Budgets/__generated__/GetBudgets";
import { BudgetCategory, BudgetItem, BudgetItemExpense } from "../types";
import ImportExpenseRow from "./Row";
import WebViewHack, { SELECT_FILE } from "./WebViewHack";
import Device from "@src/utils/Device";
const width = Device.width;

interface Props extends NavigationScreenConfigProps {
  budgetCategories: BudgetCategory[];
  budgetItems: BudgetItem[];
  budgetItemExpenses: BudgetItemExpense[];
}

const DataLoader = ({ navigation, ...rest }: Props) => {
  const year = navigation.getParam("year");
  const month = navigation.getParam("month");
  const { loading, data, refetch } = useQuery<GetBudgets, GetBudgetsVariables>(
    GET_BUDGET,
    {
      variables: { year, month },
    }
  );

  let budgetCategories: BudgetCategory[] = [];
  let budgetItems: BudgetItem[] = [];
  let budgetItemExpenses: BudgetItemExpense[] = [];

  if (data && data.budget) {
    budgetCategories = data.budget.budgetCategories;
    budgetItems = budgetCategories.flatMap(c => c.budgetItems);
    budgetItemExpenses = budgetItems.flatMap(i => i.budgetItemExpenses);
  }

  return (
    <ImportExpenseScreen
      budgetCategories={budgetCategories}
      budgetItems={budgetItems}
      budgetItemExpenses={budgetItemExpenses}
      navigation={navigation}
      {...rest}
    />
  );
};

const Container = styled.View({
  paddingTop: 70,
  flex: 1,
  backgroundColor: "#fff",
});

const Hidden = styled.View({
  height: 0,
});

const HeaderContainer = styled.View({
  padding: 10,
  justifyContent: "center",
  alignItems: "center",
});

class ImportExpenseScreen extends PureComponent<Props> {
  private webview = React.createRef<WebView>();
  private list = React.createRef<FlatList>();
  defaultBudgetItem: BudgetItem;

  componentDidMount() {
    this.copyOfProps();
  }

  copyOfProps = () => {
    const budgetCategoryId = this.props.budgetCategories[0].id;
    this.defaultBudgetItem = this.props.budgetItems.find(
      i => i.budgetCategoryId === budgetCategoryId
    ) || { id: 0, budgetCategoryId: 0 };
  };

  state = {
    expenses: [],
  };

  selectFile = async () => {
    if (this.webview.current) {
      this.webview.current.injectJavaScript(SELECT_FILE);
    }
    return;
    try {
      const file = await DocumentPicker.getDocumentAsync({ type: "text/csv" });
      if (file.type === "success") {
        this.parseFile(file.uri);
      }
    } catch (err) {
      // Expo didn't build with iCloud, expo turtle fallback
      if (this.webview.current) {
        this.webview.current.injectJavaScript(SELECT_FILE);
      }
    }
  };

  parseHeaders = row => {
    let headers = { date: -1, amount: -1, description: -1 };
    headers.date = row.findIndex((col: string) => {
      return col
        .toLowerCase()
        .trim()
        .includes("date");
    });
    headers.description = row.findIndex((col: string) => {
      return col
        .toLowerCase()
        .trim()
        .includes("description");
    });
    headers.amount = row.findIndex((col: string) => {
      return col
        .toLowerCase()
        .trim()
        .includes("amount");
    });

    return headers;
  };

  parseExpenses = ({ headers, expenses }) => {
    return expenses
      .filter(e => e.length >= 3)
      .map((e, key) => {
        const date = moment(e[headers.date], "MM-DD-YYYY");
        const amount = Math.abs(parseFloat(e[headers.amount]));
        const description = e[headers.description].replace(/\s+/g, " ").trim();

        return {
          key: String(key),
          date,
          amount,
          description,
        };
      });
  };

  onSelectFile = event => {
    const base64file = decodeURIComponent(
      decodeURIComponent(event.nativeEvent.data)
    );
    this.parseFile(base64file);
  };

  parseFile = file => {
    Papa.parse(file, {
      download: true,
      complete: csv => {
        if (csv.data.length) {
          const headers = this.parseHeaders(csv.data[0]);
          if (
            headers.date === -1 ||
            headers.name === -1 ||
            headers.amount === -1
          ) {
            return error("Unable to parse CSV headers");
          }

          const expenses = this.parseExpenses({
            headers,
            expenses: csv.data.slice(1),
          });
          this.setState({ expenses });
        }
      },
    });
  };

  onNext = index => {
    return this.list.current.scrollToIndex({ index: index + 1 });
  };

  renderItem = ({ item, index }) => {
    const { expenses } = this.state;
    return (
      <ImportExpenseRow
        width={width}
        onNext={this.onNext}
        onFinished={() => {
          this.setState({ expenses: [] });
        }}
        item={item}
        index={index}
        total={expenses.length}
        budgetCategories={this.props.budgetCategories}
        budgetItemExpenses={this.props.budgetItemExpenses}
        budgetItems={this.props.budgetItems}
        defaultBudgetItem={this.defaultBudgetItem}
      />
    );
  };

  render() {
    const { expenses } = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />

        <Container>
          <HeaderContainer>
            {expenses.length === 0 && (
              <View>
                <CsvUploadButton onPress={this.selectFile} />
                <Hidden>
                  <WebViewHack
                    ref={this.webview}
                    onSelectFile={this.onSelectFile}
                  />
                </Hidden>
              </View>
            )}
          </HeaderContainer>
          {expenses.length > 0 && (
            <FlatList
              extraData={width}
              windowSize={3}
              ref={this.list}
              renderItem={this.renderItem}
              showsHorizontalScrollIndicator={false}
              pagingEnabled={true}
              horizontal={true}
              scrollEnabled={false}
              data={expenses}
            />
          )}
        </Container>
      </>
    );
  }
}

export default DataLoader;
