import React, { Component } from 'react';
import {
  LayoutAnimation,
  Picker,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import { range } from 'lodash';

class DatePicker extends Component {
  state = {
    showPicker: false,
    month: null,
    year: null,
  };

  onValueChange = ({ month, year }) => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ month: month, year: year, showPicker: false });
    this.props.onChange({ month, year });
  };

  togglePicker = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ showPicker: !this.state.showPicker });
  };

  render() {
    const { month, year, onChange } = this.props;

    let date = moment(`${year}-${month}`, 'YYYY-MM');
    let yearWidth = '40%';
    let monthWidth = '60%';
    let format = 'MMMM YYYY';

    if (month === undefined) {
      date = moment(`${year}-1`, 'YYYY-MM');
      yearWidth = '100%';
      monthWidth = '0%';
      format = 'YYYY';
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.dateButton} onPress={this.togglePicker}>
          <Text style={styles.currentDate}>{date.format(format)}</Text>
        </TouchableOpacity>
        {this.state.showPicker && (
          <View style={styles.picker}>
            <Picker
              style={{ width: monthWidth }}
              selectedValue={`${this.state.month || month}`}
              onValueChange={(itemValue, itemIndex) =>
                this.onValueChange({ month: itemValue, year })}
            >
              {moment.months().map((m, i) => {
                return <Picker.Item key={m} label={m} value={String(i + 1)} />;
              })}
            </Picker>
            <Picker
              style={{ width: yearWidth }}
              selectedValue={`${this.state.year || year}`}
              onValueChange={(itemValue, itemIndex) =>
                this.onValueChange({ year: itemValue, month })}
            >
              {range(2015, new Date().getFullYear() + 3).map((y, i) => {
                return (
                  <Picker.Item key={y} label={String(y)} value={String(y)} />
                );
              })}
            </Picker>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e7e7e7',
    flexDirection: 'column',
    borderColor: '#e7e7e7',
    borderBottomColor: '#aaa',
    borderWidth: 0.5,
    width: '100%',
  },
  picker: {
    borderColor: 'transparent',
    borderTopColor: '#aaa',
    borderWidth: 0.5,
    flexDirection: 'row',
  },
  dateButton: {
    padding: 10,
  },
  currentDate: {
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 18,
    color: '#444',
  },
});
export default DatePicker;
