import { colors } from "@shared/theme";
import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, LayoutAnimation, StyleSheet } from "react-native";
import styled from "styled-components/native";

const BlurViewContainer = styled(BlurView).attrs({
  tint: "light",
  intensity: 55,
})({
  ...StyleSheet.absoluteFillObject,
  justifyContent: "center",
  alignItems: "center",
});

const Spinner = ({ delay }: { delay: number }) => {
  const [delayed, setDelayed] = useState(delay > 0);

  useEffect(() => {
    if (delayed) {
      const timeout = setTimeout(() => {
        LayoutAnimation.easeInEaseOut();
        setDelayed(false);
      }, delay);

      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }
  }, []);

  return !delayed ? (
    <BlurViewContainer>
      <ActivityIndicator size="large" color={colors.primary} />
    </BlurViewContainer>
  ) : null;
};

const Spin = ({ delay = 300, spinning = false }) =>
  spinning ? <Spinner delay={delay} /> : null;

export default Spin;
