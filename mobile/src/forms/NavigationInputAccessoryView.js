import React, { PureComponent } from 'react';
import {
  Keyboard,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import InputAccessoryView from 'react-native/Libraries/Components/TextInput/InputAccessoryView';
import { Ionicons } from '@expo/vector-icons';

class NavigationInputAccessoryView extends PureComponent {
  render() {
    const prevDisabled = this.props.prev === undefined;
    const nextDisabled = this.props.next === undefined;

    const nextStyles = nextDisabled
      ? styles.disabledArrow
      : styles.enabledArrow;

    const prevStyles = prevDisabled
      ? styles.disabledArrow
      : styles.enabledArrow;

    const onDone = this.props.done ? this.props.done : Keyboard.dismiss;

    return (
      <InputAccessoryView nativeID={this.props.input} style={styles.accessory}>
        <View style={styles.container}>
          <View style={styles.arrowContainer}>
            <TouchableOpacity disabled={prevDisabled} onPress={this.props.prev}>
              <Ionicons style={prevStyles} name="ios-arrow-up" size={32} />
            </TouchableOpacity>
            <TouchableOpacity disabled={nextDisabled} onPress={this.props.next}>
              <Ionicons style={nextStyles} name="ios-arrow-down" size={32} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onDone}>
            <Text style={styles.doneButton}>Done</Text>
          </TouchableOpacity>
        </View>
      </InputAccessoryView>
    );
  }
}

const iosBlue = '#177efb';
const styles = StyleSheet.create({
  accessory: {
    flex: 1,
    width: '100%',
  },
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0f1f2',
    borderTopColor: '#a0a3a5',
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  enabledArrow: {
    paddingHorizontal: 5,
    color: iosBlue,
  },
  disabledArrow: {
    opacity: 0.7,
    paddingHorizontal: 5,
    color: '#ccc',
  },
  doneButton: {
    textAlign: 'right',
    fontWeight: '700',
    padding: 12,
    fontSize: 16,
    color: iosBlue,
  },
});

export default NavigationInputAccessoryView;
