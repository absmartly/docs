import { FC } from "react";
import React from "react";
import IdealImage from "@theme/IdealImage";

interface ImageProps {
  img: string;
  alt?: string;
  maxWidth?: number;
  centered?: boolean;
}

export const Image: FC<ImageProps> = ({
  centered = true,
  maxWidth,
  alt,
  img,
}) => (
  <div style={{ maxWidth, margin: centered && "0.5rem auto" }}>
    <IdealImage img={require(`../../../static/img/${img}`)} alt={alt} />
  </div>
);
