import { Bold } from "@src/components/Text";
import moment from "moment";
import React from "react";
import styled from "styled-components/native";
import { colors } from "@shared/theme";

const SectionHeaderContainer = styled.View({
  padding: 25,
  paddingBottom: 10,
});

const SectionHeaderText = styled(Bold)({
  color: "#555",
  fontWeight: "bold",
});

const SectionHeader = ({ title }: { title: string }) => {
  return (
    <SectionHeaderContainer>
      <SectionHeaderText>
        {moment(title, "YYYY-MM-DD")
          .format("MMMM DD")
          .toUpperCase()}
      </SectionHeaderText>
    </SectionHeaderContainer>
  );
};

export default React.memo(SectionHeader);
