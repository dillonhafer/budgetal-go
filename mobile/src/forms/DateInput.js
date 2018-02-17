import React, { PureComponent } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Picker,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import { range } from 'lodash';

class DateInput extends PureComponent {
  state = {
    showDatePicker: false,
    internalDate: null,
  };

  toggleDatePicker = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ showDatePicker: !this.state.showDatePicker });
  };

  onValueChange = ({ year, month, day }) => {
    const date = moment(`${year}-${month}-${day}`, 'YYYY-MMMM-DD');
    this.setState({ internalDate: date });
    this.props.onChange(date);
  };

  render() {
    const { defaultValue, format } = this.props;
    const { internalDate, showDatePicker } = this.state;
    const date = internalDate || defaultValue || moment();
    const dateFormat = format || 'MMMM DD, YYYY';

    const year = date.format('YYYY');
    const month = date.format('MMMM');
    const day = date.format('DD');

    return (
      <View style={{ width: '100%', flexDirection: 'column' }}>
        <TouchableOpacity
          style={styles.rowButton}
          onPress={this.toggleDatePicker}
        >
          <View>
            <Text style={styles.displayDate}>{date.format(dateFormat)}</Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            style={{ paddingRight: 10 }}
            color={'#ced0ce'}
          />
        </TouchableOpacity>
        {showDatePicker && (
          <View style={styles.picker}>
            <Picker
              style={{ width: '50%' }}
              selectedValue={month}
              onValueChange={itemValue =>
                this.onValueChange({ month: itemValue, year, day })
              }
            >
              {moment.months().map(m => {
                return <Picker.Item key={m} label={m} value={m} />;
              })}
            </Picker>
            <Picker
              style={{ width: '20%' }}
              selectedValue={day}
              onValueChange={itemValue =>
                this.onValueChange({ day: itemValue, month, year })
              }
            >
              {range(1, 1 + date.daysInMonth()).map(y => {
                return (
                  <Picker.Item key={y} label={String(y)} value={String(y)} />
                );
              })}
            </Picker>
            <Picker
              style={{ width: '30%' }}
              selectedValue={year}
              onValueChange={itemValue =>
                this.onValueChange({ year: itemValue, month, day })
              }
            >
              {range(2015, new Date().getFullYear() + 3).map(y => {
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
  rowButton: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  displayDate: {
    marginLeft: 20,
  },
  picker: {
    width: '100%',
    borderColor: 'transparent',
    borderWidth: 0.5,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
});

export default DateInput;
