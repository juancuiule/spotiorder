import React from "react";
import { Image } from "../types";

interface Props {
  id: string;
  name: string;
  album: {
    images: Image[];
  };
}

export default function Track(props: Props) {
  const {
    id,
    name,
    album: { images }
  } = props;

  return (
    <div>
      <h3>{name}</h3>
      <img src={images[0].url} width="100px" height="100px" alt="album cover" />
    </div>
  );
}
