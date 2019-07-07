import { validEmail } from "@shared/helpers";
import Monogram, { User } from "@src/components/Monogram";
import { FieldContainer, focus, PrimaryButton } from "@src/forms";
import { notice } from "@src/notify";
import { GetCurrentUser } from "@src/screens/Drawer/__generated__/GetCurrentUser";
import gql from "graphql-tag";
import React, { useRef, useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import { TextInput, View } from "react-native";
import styled from "styled-components/native";
import { UserUpdate, UserUpdateVariables } from "./__generated__/UserUpdate";

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

const ImageButton = styled.TouchableOpacity({
  alignItems: "center",
  justifyContent: "center",
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

interface ImageProps {
  onPress(): void;
  user: User;
}

const ProfileImage = ({ onPress, user }: ImageProps) => {
  return (
    <ImageButton onPress={onPress}>
      <ImageContainer>
        <Monogram user={user} size={150} />
      </ImageContainer>
    </ImageButton>
  );
};

interface Props {
  onProfilePress(): void;
  afterSubmit(): void;
  image: string | null;
}

const AccountForm = ({ onProfilePress, afterSubmit, image }: Props) => {
  const { data } = useQuery<GetCurrentUser>(CURRENT_USER);
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

  let file = null;
  if (image) {
    file = { uri: image, name: "avatar" };
  }

  const [submit, { loading }] = useMutation<UserUpdate, UserUpdateVariables>(
    USER_UPDATE,
    {
      variables: {
        userInput: {
          email,
          firstName: firstName.length > 0 ? firstName : null,
          lastName: lastName.length > 0 ? lastName : null,
          password: currentPassword,
        },
        file,
      },
    }
  );

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

export default AccountForm;
