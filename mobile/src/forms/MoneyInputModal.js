import React, { PureComponent } from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  Clipboard,
  StyleSheet,
  View,
} from 'react-native';

// Components
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@shared/theme';
import MoneyKeyboard from '@src/utils/MoneyKeyboard';
import Modal from 'react-native-modalbox';
import MoneyAnimation from '@src/components/MoneyAnimation';
import { Medium } from '@src/components/Text';

class MoneyInputModal extends PureComponent {
  state = {
    amount: '0',
    pastValue: null,
  };

  onNumberChanged = number => {
    this.setState({ amount: number, pasteValue: null });
  };

  onCancel = () => {
    this.setState({ amount: '0', pasteValue: null });
    this.props.onCancel();
  };

  onOk = () => {
    this.props.onOk(this.state.amount);
  };

  onPaste = async () => {
    const pasteValue = await Clipboard.getString();
    this.setState({ pasteValue });
  };

  render() {
    const { amount, pasteValue } = this.state;
    const { title, visible, defaultValue } = this.props;
    const invalid = amount <= 0;

    return (
      <Modal
        style={{
          backgroundColor: 'transparent',
        }}
        coverScreen={true}
        isOpen={visible}
        backdrop={false}
        backButtonClose={true}
        onClosed={this.onCancel}
        onRequestClose={() => {}}
      >
        <BlurView tint="light" intensity={95} style={styles.modal}>
          <SafeAreaView style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={this.onCancel}
            >
              <Ionicons
                name="ios-close-circle-outline"
                size={34}
                color={colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.pasteButton} onPress={this.onPaste}>
              <Ionicons name="ios-clipboard" size={34} color={colors.primary} />
            </TouchableOpacity>
          </SafeAreaView>

          <View style={styles.content}>
            <View style={{ padding: 20, paddingTop: 40, alignItems: 'center' }}>
              <MoneyAnimation />
              <Medium style={{ margin: 5, textAlign: 'center' }}>
                {title}
              </Medium>
            </View>
          </View>

          <MoneyKeyboard
            pasteValue={pasteValue}
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
  content: {
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: 22,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    padding: 10,
    paddingLeft: 15,
  },
  pasteButton: {
    padding: 10,
    paddingRight: 15,
  },
});

export default MoneyInputModal;
