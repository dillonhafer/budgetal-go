import React, { useState } from "react";
import { Image, Text } from "react-native";
import styled from "styled-components/native";

const MonogramText = styled.Text<{ fontSize: number }>(props => ({
  color: "white",
  fontSize: props.fontSize,
}));

export interface User {
  email: string;
  firstName?: string | undefined | null;
  lastName?: string | undefined | null;
  avatarUrl?: string | undefined | null;
}

interface Props {
  user: User;
  size?: number;
}

const firstLetter = (word?: string | undefined | null) =>
  (word || "").charAt(0).toUpperCase();

const Monogram = ({ user, size = 50 }: Props) => {
  const [imageAvailable, setImageAvailable] = useState(!!user.avatarUrl);

  const uri = user.avatarUrl;
  const letters = firstLetter(user.firstName) + firstLetter(user.lastName);

  if (imageAvailable && uri) {
    return (
      <Image
        onError={() => {
          setImageAvailable(false);
        }}
        style={{ height: size, width: size }}
        source={{ uri }}
      />
    );
  }

  return (
    <MonogramText fontSize={size / 2}>
      {letters.length ? letters : "?"}
    </MonogramText>
  );
};

const shouldSkipUpdate = (prev: Props, next: Props) =>
  prev.user.avatarUrl === next.user.avatarUrl &&
  prev.user.firstName === next.user.firstName &&
  prev.user.lastName === next.user.lastName;

export default React.memo(Monogram, shouldSkipUpdate);
