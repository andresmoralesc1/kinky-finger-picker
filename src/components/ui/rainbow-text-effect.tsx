"use client";

import React, { useEffect, useState } from "react";

interface RainbowTextEffectProps {
  text?: string;
  className?: string;
  fontSize?: number | string;
}

export function RainbowTextEffect({
  fontSize = 20,
  text = "kinky",
  className = "",
}: RainbowTextEffectProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 500);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Multi-layered 3D shadow extrusion adapted to the Red & White dark aesthetic
  const desktopTextShadow = `
    2px 4px #FF4D5A, 2px 6px #000, 
    4px 8px #E50914, 4px 10px #000, 
    6px 12px #B20710, 6px 14px #000, 
    8px 16px #8A000B, 8px 18px #000, 
    10px 20px #5E0007, 10px 22px #000, 
    12px 24px #380004, 12px 26px #000, 
    14px 28px #1A0002, 14px 30px #000
  `;

  const mobileStyles: React.CSSProperties = {
    textShadow: "0 4px 18px rgba(229, 9, 20, 0.6)",
    background: "linear-gradient(to bottom, #FFFFFF 10%, #FF4D5A 50%, #E50914 90%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    lineHeight: "115%",
  };

  const desktopStyles: React.CSSProperties = {
    color: "#FFFFFF",
    WebkitTextStroke: "1px rgba(0, 0, 0, 0.8)",
    textShadow: desktopTextShadow,
    lineHeight: "100%",
  };

  const baseStyles: React.CSSProperties = {
    fontFamily: "'Inter', 'Open Sans', system-ui, -apple-system, sans-serif",
    fontStyle: "italic",
    fontSize: typeof fontSize === "number" ? `${fontSize}vw` : fontSize,
    fontWeight: 900,
    textTransform: "uppercase",
    wordBreak: "break-word",
    letterSpacing: "-0.04em",
    margin: 0,
    padding: 0,
    userSelect: "none",
  };

  return (
    <div
      style={{
        textAlign: "center",
      }}
      className={className}
    >
      <p
        style={{
          ...baseStyles,
          ...(isMobile ? mobileStyles : desktopStyles),
        }}
      >
        {text}
      </p>
    </div>
  );
}

export default RainbowTextEffect;
