import React, { useState } from "react";
import { Image, Text } from "react-native";
import styled from "styled-components/native";

const MonogramText = styled.Text({
  color: "white",
  fontSize: 25,
});

export interface User {
  email: string;
  firstName?: string | undefined;
  lastName?: string | undefined;
  avatarUrl?: string | undefined;
}

interface Props {
  user: User;
  size?: number;
}

const firstLetter = (word?: string | undefined) =>
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

  return <MonogramText>{letters.length ? letters : "?"}</MonogramText>;
};

export default Monogram;
