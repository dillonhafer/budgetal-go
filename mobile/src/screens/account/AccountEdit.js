import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  StatusBar,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';

// Redux
import { connect } from 'react-redux';
import { updateCurrentUser } from 'actions/users';

// API
import { UpdateAccountInfoRequest } from 'api/users';

// Helpers
import { error, notice } from 'notify';

// Components
import { PrimaryButton, FieldContainer } from 'forms';
import { SetCurrentUser } from 'utils/authentication';
import { ImagePicker, BlurView } from 'expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class AccountEditScreen extends Component {
  static navigationOptions = {
    title: 'Account Edit',
  };

  inputs = [];

  state = {
    email: '',
    firstName: '',
    lastName: '',
    currentPassword: '',
    avatarUrl: '',
    image: null,
    loading: false,
    showImagePicker: false,
  };

  componentDidMount() {
    const {
      email,
      firstName,
      lastName,
      avatarUrl,
    } = this.props.navigation.state.params.user;
    this.setState({ email, firstName, lastName, avatarUrl });
  }

  validateFields = () => {
    const { currentPassword, email, firstName, lastName } = this.state;
    return (
      email.length > 0 &&
      firstName.length > 0 &&
      lastName.length > 0 &&
      currentPassword.length > 0
    );
  };

  focusNextField(key) {
    this.inputs[key].focus();
  }

  handleImage = async pickerOption => {
    const imageOptions = {
      allowsEditing: true,
      aspect: [4, 3],
      exif: false,
    };
    const result = await pickerOption(imageOptions);
    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.hideImagePicker();
    } else {
      this.showImagePicker();
    }
  };

  showImagePicker = () => {
    StatusBar.setBarStyle('light-content', true);
    this.setState({ showImagePicker: true });
  };

  hideImagePicker = () => {
    StatusBar.setBarStyle('light-dark', true);
    this.setState({ showImagePicker: false });
  };

  updateAccountInfo = async () => {
    const { email, firstName, lastName, currentPassword } = this.state;

    let data = new FormData();
    data.append('firstName', firstName);
    data.append('lastName', lastName);
    data.append('email', email);
    data.append('password', currentPassword);
    if (this.state.image) {
      data.append('avatar', { uri: this.state.image, name: 'avatar' });
    }

    try {
      const resp = await UpdateAccountInfoRequest(data);
      if (resp && resp.ok) {
        notice('Account Updated');
        this.props.updateCurrentUser(resp.user);
        SetCurrentUser(resp.user);
        this.props.navigation.goBack();
      }
    } catch (err) {
      error(err.error);
    }
  };

  handleOnPress = () => {
    this.setState({ loading: true });
    try {
      if (this.validateFields()) {
        this.updateAccountInfo();
      } else {
        error('Form is not valid');
      }
    } catch (err) {
      // console.log(err)
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      email,
      firstName,
      lastName,
      loading,
      avatarUrl,
      image,
      showImagePicker,
    } = this.state;

    const uri = image || avatarUrl;
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={showImagePicker}
        >
          <BlurView tint="dark" intensity={95} style={styles.modal}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                this.handleImage(ImagePicker.launchCameraAsync);
              }}
            >
              <MaterialCommunityIcons name="camera" size={80} color={'#fff'} />
              <Text style={{ color: '#fff', fontSize: 20 }}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                StatusBar.setBarStyle('dark-content', true);
                this.handleImage(ImagePicker.launchImageLibraryAsync);
              }}
            >
              <MaterialCommunityIcons
                name="folder-multiple-image"
                size={80}
                color={'#fff'}
              />
              <Text style={{ color: '#fff', fontSize: 20 }}>Photos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 10, width: '100%' }}
              onPress={this.hideImagePicker}
            >
              <Text style={{ textAlign: 'center', color: '#fff' }}>Cancel</Text>
            </TouchableOpacity>
          </BlurView>
        </Modal>
        <StatusBar barStyle="dark-content" />
        <TouchableOpacity onPress={this.showImagePicker}>
          <View style={styles.imageContainer}>
            {uri && <Image style={styles.image} source={{ uri }} />}
          </View>
        </TouchableOpacity>
        <FieldContainer position="first">
          <TextInput
            keyboardType="email-address"
            style={{ height: 50 }}
            placeholder="Email"
            autoCapitalize={'none'}
            defaultValue={email}
            autoCorrect={false}
            ref={input => {
              this.inputs['email'] = input;
            }}
            onSubmitEditing={_ => {
              this.focusNextField('firstName');
            }}
            returnKeyType="next"
            enablesReturnKeyAutomatically={true}
            onChangeText={email => this.setState({ email })}
          />
        </FieldContainer>
        <FieldContainer>
          <TextInput
            style={{ height: 50 }}
            enablesReturnKeyAutomatically={true}
            ref={input => {
              this.inputs['firstName'] = input;
            }}
            placeholder="First Name"
            defaultValue={firstName}
            returnKeyType="next"
            onSubmitEditing={_ => {
              this.focusNextField('lastName');
            }}
            onChangeText={firstName => this.setState({ firstName })}
          />
        </FieldContainer>
        <FieldContainer>
          <TextInput
            style={{ height: 50 }}
            enablesReturnKeyAutomatically={true}
            ref={input => {
              this.inputs['lastName'] = input;
            }}
            placeholder="Last Name"
            defaultValue={lastName}
            returnKeyType="next"
            onSubmitEditing={_ => {
              this.focusNextField('currentPassword');
            }}
            onChangeText={lastName => this.setState({ lastName })}
          />
        </FieldContainer>

        <View style={{ height: 10 }} />

        <FieldContainer position="first">
          <TextInput
            style={{ height: 50 }}
            enablesReturnKeyAutomatically={true}
            secureTextEntry={true}
            ref={input => {
              this.inputs['currentPassword'] = input;
            }}
            placeholder="Current Password"
            returnKeyType="done"
            onSubmitEditing={this.handleOnPress}
            onChangeText={currentPassword => this.setState({ currentPassword })}
          />
        </FieldContainer>

        <PrimaryButton
          title="Update Account Info"
          onPress={this.handleOnPress}
          loading={loading}
        />
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: 40,
  },
  imageContainer: {
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderWidth: 3,
    borderColor: '#aaa',
    borderRadius: 75,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButton: {
    borderWidth: 4,
    borderColor: '#fff',
    borderRadius: 10,
    padding: 30,
    margin: 30,
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect(
  state => ({
    user: state.users,
  }),
  dispatch => ({
    updateCurrentUser: user => {
      dispatch(updateCurrentUser(user));
    },
  }),
)(AccountEditScreen);
