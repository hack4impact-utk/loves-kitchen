'use client';

import React from 'react';
import { useQRCode } from 'next-qrcode';

interface QRProps {
  url: string;
  width: number;
}

const QRDisplay = (props: QRProps) => {
  const { Canvas } = useQRCode();

  return (
    <Canvas
      text={props.url}
      options={{
        errorCorrectionLevel: 'M',
        margin: 0,
        width: props.width,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      }}
    />
  );
};

export default QRDisplay;
