import React, { PureComponent } from 'react';
import Modal from 'react-native-modalbox';

import { BlurView } from 'expo-blur';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@shared/theme';
import FieldContainer from './FieldContainer';
import { Medium } from 'components/Text';

class OptionInput extends PureComponent {
  state = {
    visible: false,
  };

  togglePicker = () => {
    this.setState({ visible: true });
  };

  onCancel = () => {
    this.setState({ visible: false });
  };

  onValueChange = selectedItem => {
    this.setState({ selectedItem, visible: false });
    this.props.onChange(selectedItem);
  };

  render() {
    const { defaultValue, placeholder } = this.props;
    const { selectedItem = { value: defaultValue }, visible } = this.state;

    let placeholderStyles = {};
    if (!selectedItem.value) {
      placeholderStyles.opacity = 0.5;
    }

    return (
      <View style={{ width: '100%', flexDirection: 'column' }}>
        <TouchableOpacity style={styles.rowButton} onPress={this.togglePicker}>
          <View>
            <Text style={placeholderStyles}>
              {selectedItem.label || placeholder}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            style={{ paddingRight: 10 }}
            color={'#ced0ce'}
          />
        </TouchableOpacity>
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
              <Medium style={{ fontWeight: '700' }}>
                {placeholder.toUpperCase()}
              </Medium>
              <View style={styles.headerRight} />
            </SafeAreaView>

            <View style={styles.content}>
              {this.props.options.map((o, i) => (
                <FieldContainer key={o.value} position={i === 0 ? 'first' : ''}>
                  <TouchableOpacity
                    style={styles.amountButton}
                    onPress={() => {
                      this.onValueChange(o);
                    }}
                  >
                    <View>
                      <Text style={styles.displayAmount}>{o.label}</Text>
                    </View>
                    {selectedItem.value === o.value && (
                      <MaterialCommunityIcons
                        name="check"
                        size={22}
                        style={{ paddingRight: 10 }}
                        color={colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                </FieldContainer>
              ))}
            </View>
          </BlurView>
        </Modal>
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
  modal: {
    flex: 1,
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
  amountButton: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    width: 53,
  },
});

export default OptionInput;
