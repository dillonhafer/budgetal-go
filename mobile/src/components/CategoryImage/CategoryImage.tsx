import React from "react";
import { categoryImage } from "@src/assets/images";
import styled from "styled-components/native";

const Image = styled.Image<{ size: number }>(({ size }) => ({
  width: size,
  height: size,
}));

interface Props {
  size?: number;
  name: string;
}

const CategoryImage = ({ size = 64, name }: Props) => (
  <Image size={size} source={categoryImage(name)} />
);

export default CategoryImage;
