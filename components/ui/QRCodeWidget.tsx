"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRCodeWidgetProps {
  url?: string;
  size?: number;
  label?: string;
}

export default function QRCodeWidget({
  url = "https://made2match.in",
  size = 96,
  label = "Scan to open",
}: QRCodeWidgetProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="rounded-2xl bg-white p-3 shadow-lg border border-gray-100"
        style={{ lineHeight: 0 }}
      >
        <QRCodeSVG
          value={url}
          size={size}
          bgColor="#ffffff"
          fgColor="#c0174c"
          level="H"
          includeMargin={false}
        />
      </div>
      <p className="text-[10px] font-bold text-gray-500 tracking-wide text-center">
        {label}
      </p>
    </div>
  );
}
