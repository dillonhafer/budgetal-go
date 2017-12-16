import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Modal, View, Text } from 'react-native';

// Components
import { BlurView } from 'expo';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import colors from 'utils/colors';
import { currencyf } from 'utils/helpers';
import MoneyKeyboard from 'utils/MoneyKeyboard';
import { PrimaryButton } from 'forms';

class MoneyInputModal extends Component {
  state = {
    amount: '0',
  };

  onNumberChanged = number => {
    this.setState({ amount: number });
  };

  onCancel = () => {
    this.setState({ amount: '0' });
    this.props.onCancel();
  };

  onOk = () => {
    this.props.onOk(this.state.amount);
  };

  render() {
    const { amount } = this.state;
    const { title, visible, onOk, onCancel, defaultValue } = this.props;
    const invalid = amount <= 0;

    return (
      <Modal visible={visible} animationType={'slide'} transparent={true}>
        <BlurView tint="light" intensity={95} style={styles.modal}>
          <TouchableOpacity style={styles.closeButton} onPress={this.onCancel}>
            <Ionicons
              name="ios-close-circle-outline"
              size={34}
              color={colors.primary}
            />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={{ padding: 20, paddingTop: 40, alignItems: 'center' }}>
              <FontAwesome name="money" size={32} color={colors.success} />
              <Text
                style={{ margin: 5, textAlign: 'center', fontWeight: 'bold' }}
              >
                {title}
              </Text>
            </View>
          </View>

          <MoneyKeyboard
            defaultValue={defaultValue}
            onChange={this.onNumberChanged}
            onPress={invalid ? null : this.onOk}
          />
        </BlurView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  closeButton: {
    paddingLeft: 15,
    paddingTop: 25,
    paddingBottom: 15,
  },
});

export default MoneyInputModal;
