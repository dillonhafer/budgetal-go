import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ScrollView,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import { updateBudgetCategory } from 'actions/budgets';

// Helpers
import { BlurViewInsetProps } from 'utils/navigation-helpers';
import { error } from 'notify';
import Device from 'utils/Device';
const isTablet = Device.isTablet();
import { DocumentPicker } from 'expo';

import Papa from 'papaparse';
import moment from 'moment';
import colors from 'utils/colors';

import WebViewHack from './WebViewHack';
import CsvUploadButton from 'components/CsvUploadButton';
import ImportExpenseRow from './ImportExpenseRow';

const tabletMargin = 20;
const tabletWidthSubtrahend = isTablet ? tabletMargin * 2 : 0;

const DoneButton = connect(null, dispatch => ({
  changeCategory: c => {
    dispatch(updateBudgetCategory({ budgetCategory: c }));
  },
}))(
  class DoneButton extends PureComponent {
    render() {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.changeCategory({ id: -1, name: '' });
            this.props.screenProps.layoutNavigate('Main');
          }}
        >
          <Text
            style={{ color: colors.iosBlue, padding: 20, fontWeight: '700' }}
          >
            Done
          </Text>
        </TouchableOpacity>
      );
    }
  },
);

class ImportExpenseScreen extends PureComponent {
  static navigationOptions = ({ screenProps }) => {
    if (!screenProps.isTablet) {
      return {};
    }

    return {
      headerLeft: <DoneButton screenProps={screenProps} />,
    };
  };

  componentDidMount() {
    this.copyOfProps();
  }

  copyOfProps = () => {
    const budgetCategoryId = this.props.budgetCategories[0].id;
    this.defaultBudgetItem = this.props.budgetItems.find(
      i => i.budgetCategoryId === budgetCategoryId,
    ) || { id: 0, budgetCategoryId: 0 };
  };

  state = {
    expenses: [],
    width: 100,
  };

  goBack = () => {
    this.props.screenProps.goBack();
  };

  selectFile = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
      if (file.type === 'success') {
        this.parseFile(file.uri);
      }
    } catch (err) {
      // Expo didn't build with iCloud, expo turtle fallback
      this.webview.injectJavaScript('selectFile()');
    }
  };

  parseHeaders = row => {
    let headers = { date: -1, amount: -1, description: -1 };
    headers.date = row.findIndex(col => {
      return col
        .toLowerCase()
        .trim()
        .includes('date');
    });
    headers.description = row.findIndex(col => {
      return col
        .toLowerCase()
        .trim()
        .includes('description');
    });
    headers.amount = row.findIndex(col => {
      return col
        .toLowerCase()
        .trim()
        .includes('amount');
    });

    return headers;
  };

  parseExpenses = ({ headers, expenses }) => {
    return expenses.filter(e => e.length >= 3).map((e, key) => {
      const date = moment(e[headers.date], 'MM-DD-YYYY');
      const amount = Math.abs(parseFloat(e[headers.amount]));
      const description = e[headers.description].replace(/\s+/g, ' ').trim();

      return {
        key,
        date,
        amount,
        description,
      };
    });
  };

  onSelectFile = event => {
    const base64file = event.nativeEvent.data;
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
            return error('Unable to parse CSV headers');
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
    return this.importList.scrollToIndex({ index: index + 1 });
  };

  renderItem = ({ item, index }) => {
    const { expenses, width } = this.state;
    return (
      <ImportExpenseRow
        width={width}
        onNext={this.onNext}
        onDone={this.goBack}
        item={item}
        index={index}
        total={expenses.length}
        defaultBudgetItem={this.defaultBudgetItem}
      />
    );
  };

  render() {
    const { expenses, width } = this.state;
    return (
      <View
        style={styles.container}
        onLayout={event => {
          const { width } = event.nativeEvent.layout;
          this.setState({ width: width - tabletWidthSubtrahend });
        }}
      >
        <StatusBar barStyle="dark-content" />
        <ScrollView style={{ width: '100%' }} {...BlurViewInsetProps}>
          <View style={styles.listContainer}>
            <View style={styles.headerContainer}>
              {expenses.length === 0 && (
                <View style={{ marginVertical: 50 }}>
                  <CsvUploadButton onPress={this.selectFile} />
                </View>
              )}
            </View>
            <View style={{ width }}>
              <FlatList
                extraData={width}
                windowSize={2}
                ref={list => (this.importList = list)}
                renderItem={this.renderItem}
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
                horizontal={true}
                scrollEnabled={false}
                data={expenses}
              />
            </View>
            <View style={styles.footerContainer}>
              <WebViewHack
                ref={webview => {
                  if (webview && webview.webview) {
                    this.webview = webview.webview;
                  }
                }}
                onSelectFile={this.onSelectFile}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    backgroundColor: isTablet ? 'transparent' : '#fff',
  },
  listContainer: {
    margin: isTablet ? tabletMargin : 0,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  headerContainer: {
    padding: 10,
  },
  footerContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default connect(state => ({
  ...state.budget,
}))(ImportExpenseScreen);
