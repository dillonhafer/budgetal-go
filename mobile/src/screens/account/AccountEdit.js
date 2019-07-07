import React, { Component, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  StatusBar,
  View,
  Image,
  TouchableOpacity,
} from "react-native";

// API
import { UpdateAccountInfoRequest } from "@shared/api/users";

// Helpers
import { error, notice } from "@src/notify";
import { BlurViewInsetProps } from "@src/utils/navigation-helpers";

// Components
import { focus, PrimaryButton, FieldContainer } from "@src/forms";
import { SetCurrentUser } from "@src/utils/authentication";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modalbox";
import Monogram from "@src/components/Monogram";
import gql from "graphql-tag";
import { useQuery, useMutation } from "react-apollo";
import styled from "styled-components/native";
import { colors } from "@shared/theme";
import { validEmail } from "@shared/helpers";
// import { GetCurrentUser } from "@src/screens/Drawer/__generated__/GetCurrentUser";

const CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      admin
      avatarUrl
      email
      firstName
      id
      lastName
    }
  }
`;

const USER_UPDATE = gql`
  mutation UserUpdate($userInput: UserInput, $file: Upload) {
    userUpdate(userInput: $userInput, file: $file) {
      id
      avatarUrl
      email
      firstName
      lastName
    }
  }
`;

const Container = styled.View({
  flex: 1,
  backgroundColor: colors.backgroundColor,
});

const ImageContainer = styled.View({
  margin: 20,
  borderWidth: 3,
  borderColor: "#aaa",
  backgroundColor: "#aaa",
  borderRadius: 75,
  width: 150,
  height: 150,
  overflow: "hidden",
  justifyContent: "center",
  alignItems: "center",
});

const ProfileImage = ({ onPress, user }) => {
  return (
    <TouchableOpacity
      style={{ alignItems: "center", justifyContent: "center" }}
      onPress={onPress}
    >
      <ImageContainer>
        <Monogram user={user} size={150} />
      </ImageContainer>
    </TouchableOpacity>
  );
};

const Form = ({ onProfilePress, afterSubmit, image }) => {
  const { data } = useQuery(CURRENT_USER);
  if (!data || !data.currentUser) {
    return null;
  }
  let user = data.currentUser;

  if (image) {
    user = { ...user, avatarUrl: image };
  }
  const [email, setEmail] = useState(user.email);
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [currentPassword, setCurrentPassword] = useState("");

  const [submit, { loading }] = useMutation(USER_UPDATE, {
    variables: {
      userInput: {
        email,
        firstName,
        lastName,
        currentPassword,
      },
      file: image ? { uri: image, name: "avatar" } : null,
    },
  });

  const firstNameField = useRef(null);
  const lastNameField = useRef(null);
  const currentPasswordField = useRef(null);

  const valid = validEmail(email) && currentPassword.length > 0;

  const submitForm = () => {
    if (valid) {
      submit().then(() => {
        notice("Account Updated");
        afterSubmit();
      });
    }
  };

  return (
    <>
      <ProfileImage user={user} onPress={onProfilePress} />

      <FieldContainer position="first">
        <TextInput
          keyboardType="email-address"
          style={{ height: 50 }}
          placeholder="Email"
          autoCapitalize={"none"}
          defaultValue={email}
          underlineColorAndroid={"transparent"}
          autoCorrect={false}
          onSubmitEditing={() => focus(firstNameField)}
          returnKeyType="next"
          enablesReturnKeyAutomatically={true}
          onChangeText={setEmail}
        />
      </FieldContainer>
      <FieldContainer>
        <TextInput
          style={{ height: 50 }}
          enablesReturnKeyAutomatically={true}
          ref={firstNameField}
          placeholder="First Name"
          underlineColorAndroid={"transparent"}
          defaultValue={firstName}
          returnKeyType="next"
          onSubmitEditing={() => focus(lastNameField)}
          onChangeText={setFirstName}
        />
      </FieldContainer>
      <FieldContainer>
        <TextInput
          style={{ height: 50 }}
          enablesReturnKeyAutomatically={true}
          ref={lastNameField}
          placeholder="Last Name"
          underlineColorAndroid={"transparent"}
          defaultValue={lastName}
          returnKeyType="next"
          onSubmitEditing={() => focus(currentPasswordField)}
          onChangeText={setLastName}
        />
      </FieldContainer>

      <View style={{ height: 10 }} />

      <FieldContainer position="first">
        <TextInput
          style={{ height: 50 }}
          enablesReturnKeyAutomatically={true}
          secureTextEntry={true}
          autoCapitalize={"none"}
          ref={currentPasswordField}
          underlineColorAndroid={"transparent"}
          placeholder="Current Password"
          returnKeyType="done"
          onSubmitEditing={submitForm}
          onChangeText={setCurrentPassword}
        />
      </FieldContainer>

      <PrimaryButton
        title="Update Account Info"
        onPress={submitForm}
        loading={loading}
        disabled={!valid || loading}
      />
    </>
  );
};

class AccountEditScreen extends Component {
  state = {
    image: null,
    showImagePicker: false,
  };

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
    StatusBar.setBarStyle("light-content", true);
    this.setState({ showImagePicker: true });
  };

  hideImagePicker = () => {
    StatusBar.setBarStyle("light-dark", true);
    this.setState({ showImagePicker: false });
  };

  updateAccountInfo = async () => {
    const { email, firstName, lastName, currentPassword } = this.state;

    let data = new FormData();
    data.append("firstName", firstName);
    data.append("lastName", lastName);
    data.append("email", email);
    data.append("password", currentPassword);
    if (this.state.image) {
      data.append("avatar", { uri: this.state.image, name: "avatar" });
    }

    try {
      const resp = await UpdateAccountInfoRequest(data);
      if (resp && resp.ok) {
        notice("Account Updated");
        this.props.updateCurrentUser(resp.user);
        SetCurrentUser(resp.user);
        this.props.navigation.goBack();
      }
    } catch (err) {
      error(err.error);
    }
  };

  render() {
    const { image, showImagePicker } = this.state;

    return (
      <>
        <StatusBar barStyle="dark-content" />
        <Container>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            {...BlurViewInsetProps}
          >
            <Modal
              style={{
                backgroundColor: "transparent",
              }}
              coverScreen={true}
              isOpen={showImagePicker}
              backdrop={false}
              backButtonClose={true}
              onClosed={this.hideImagePicker}
              onRequestClose={() => {}}
            >
              <BlurView tint="dark" intensity={95} style={styles.modal}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={async () => {
                    const { status: cam } = await Permissions.askAsync(
                      Permissions.CAMERA
                    );
                    const { status: roll } = await Permissions.askAsync(
                      Permissions.CAMERA_ROLL
                    );
                    if (cam === "granted" && roll === "granted") {
                      this.handleImage(ImagePicker.launchCameraAsync);
                    }
                  }}
                >
                  <MaterialCommunityIcons
                    name="camera"
                    size={80}
                    color={"#fff"}
                  />
                  <Text style={{ color: "#fff", fontSize: 20 }}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={async () => {
                    const { status } = await Permissions.askAsync(
                      Permissions.CAMERA_ROLL
                    );
                    if (status === "granted") {
                      StatusBar.setBarStyle("dark-content", true);
                      this.handleImage(ImagePicker.launchImageLibraryAsync);
                    }
                  }}
                >
                  <MaterialCommunityIcons
                    name="folder-multiple-image"
                    size={80}
                    color={"#fff"}
                  />
                  <Text style={{ color: "#fff", fontSize: 20 }}>Photos</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ padding: 10, width: "100%" }}
                  onPress={this.hideImagePicker}
                >
                  <Text style={{ textAlign: "center", color: "#fff" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </BlurView>
            </Modal>

            <Form
              image={image}
              onProfilePress={this.showImagePicker}
              afterSubmit={() => {
                this.props.navigation.goBack();
              }}
            />
          </KeyboardAwareScrollView>
        </Container>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: 40,
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButton: {
    borderWidth: 4,
    borderColor: "#fff",
    borderRadius: 10,
    padding: 30,
    margin: 30,
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AccountEditScreen;
