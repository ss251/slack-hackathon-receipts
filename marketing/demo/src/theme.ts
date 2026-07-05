import { staticFile, delayRender, continueRender, cancelRender } from "remotion";
import { loadFont } from "@remotion/fonts";

export const FPS = 30;
export const W = 1920, H = 1080;

export const C = {
  bg0: "#160a18", bg1: "#2a1030", aubergine: "#4A154B",
  green: "#2eb67d", greenLt: "#42d492",
  ink: "#ffffff", sub: "rgba(255,255,255,0.72)", muted: "#cdbcd6",
};

// Local Inter (render-safe: zero network at render time)
export const FONT = "InterLocal";
const h = delayRender("inter-fonts");
Promise.all([
  loadFont({ family: FONT, url: staticFile("Inter-Regular.woff2"), weight: "400" }),
  loadFont({ family: FONT, url: staticFile("Inter-SemiBold.woff2"), weight: "600" }),
  loadFont({ family: FONT, url: staticFile("Inter-Bold.woff2"), weight: "700" }),
]).then(() => continueRender(h)).catch((e) => cancelRender(e));

export const FAMILY = `${FONT}, -apple-system, "Helvetica Neue", Arial, sans-serif`;
