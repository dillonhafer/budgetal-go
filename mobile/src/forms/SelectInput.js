import React, { Component } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  LayoutAnimation,
  Picker,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { range } from 'lodash';

class SelectInput extends Component {
  state = {
    showPicker: false,
    internalValue: null,
  };

  togglePicker = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ showPicker: !this.state.showPicker });
  };

  onValueChange = ({ internalValue }) => {
    this.setState({ internalValue });
    this.props.onChange(internalValue);
  };

  render() {
    const { defaultValue, placeholder, onChange, format, data } = this.props;
    const { internalValue, showPicker } = this.state;
    const selectedValue = internalValue || defaultValue;

    let placeholderStyles = {};
    if (!selectedValue) {
      placeholderStyles.opacity = 0.5;
    }

    return (
      <View style={{ width: '100%', flexDirection: 'column' }}>
        <TouchableOpacity style={styles.rowButton} onPress={this.togglePicker}>
          <View>
            <Text style={[styles.displayLabel, placeholderStyles]}>
              {selectedValue || placeholder}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            style={{ paddingRight: 10 }}
            color={'#ced0ce'}
          />
        </TouchableOpacity>
        {showPicker && (
          <View style={styles.picker}>
            <Picker
              style={{ width: '100%' }}
              selectedValue={selectedValue}
              onValueChange={(itemValue, itemIndex) =>
                this.onValueChange({ internalValue: itemValue })}
            >
              {(data || []).map((m, i) => {
                return (
                  <Picker.Item
                    key={m.key || i}
                    label={m.label}
                    value={m.value}
                  />
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
  displayLabel: {
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

export default SelectInput;
