"use client";

import { useEffect, useState } from "react";
import { Gradient } from "@/ext/gradient";

export function MeshGradient() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const gradient = new Gradient();
    // @ts-expect-error can't be bothered to fix types
    gradient.initGradient("#gradient-canvas");

    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const opacity = isLoaded ? "1" : "0";

  return (
    <canvas
      id="gradient-canvas"
      className="absolute inset-0 w-full h-full transition-all duration-500"
      style={
        {
          "--gradient-color-1": "#121212",
          "--gradient-color-2": "#1a1a1a",
          "--gradient-color-3": "#242424",
          opacity,
        } as React.CSSProperties
      }
      data-transition-in
    />
  );
}
