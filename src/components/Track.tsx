import React from "react";
import { Image, AudioFeature } from "../types";

interface Props {
  id: string;
  name: string;
  album: {
    images: Image[];
  };
  preview_url: string;
  features?: AudioFeature;
  keyToShow: string;
}

export default function Track(props: Props) {
  const {
    id,
    name,
    album: { images },
    preview_url,
    features,
    keyToShow
  } = props;

  const audioEl = React.useRef<HTMLAudioElement>(null);
  const playDemo = () => {
    if (preview_url !== null) {
      if (audioEl.current !== null) {
        if (audioEl.current.src === "") {
          audioEl.current.src = preview_url;
        }
        audioEl.current.play();
      }
    }
  };

  const pauseDemo = () => {
    if (preview_url !== null) {
      if (audioEl.current !== null) {
        audioEl.current.pause();
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "300px"
      }}
    >
      {preview_url !== null ? <audio ref={audioEl} /> : null}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%"
        }}
      >
        <img
          src={images[0].url}
          alt="album cover"
          style={{
            height: "120px",
            filter: preview_url !== null ? "" : "grayscale(1)"
          }}
          onMouseOver={playDemo}
          onMouseLeave={pauseDemo}
        />
        <span
          style={{
            display: "inline-block",
            fontFamily: "12px"
          }}
        >
          {name} <br />
          {features !== undefined
            ? keyToShow !== undefined
              ? `${keyToShow}: ${features[keyToShow as keyof typeof features]}`
              : ""
            : "loading..."}
        </span>
      </div>
    </div>
  );
}
