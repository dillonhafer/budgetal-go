import React, { PureComponent } from "react";
import { colors } from "@shared/theme";
import styled from "styled-components/native";

const Outer = styled.View({
  justifyContent: "center",
  backgroundColor: "#f1f1f1",
  borderColor: "#f1f1f1",
  borderWidth: 1,
  borderRadius: 10,
  height: 20,
  width: "100%",
  overflow: "hidden",
});

const Meter = styled.View(({ color, percent }) => ({
  backgroundColor: color,
  borderColor: color,
  borderRadius: 10,
  borderWidth: 0,
  height: 20,
  width: `${percent}%`,
}));

export default class Progress extends PureComponent {
  render() {
    const { status, percent } = this.props;
    let color = colors.primary;

    if ((status && status === "exception") || (!status && percent > 100)) {
      color = colors.error;
    }
    if ((status && status === "success") || (!status && percent === 100)) {
      color = colors.success;
    }

    return (
      <Outer>
        <Meter color={color} percent={percent} />
      </Outer>
    );
  }
}
