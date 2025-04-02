"use client";

import { deviceType } from "detect-it";
import { MeshGradient } from "./gMesh";

export function GradientContainer() {
  if (deviceType === "touchOnly") {
    return;
  }

  return (
    <div className="fixed inset-0 transition-[filter] duration-500 pointer-events-none">
      <MeshGradient />
    </div>
  );
}
