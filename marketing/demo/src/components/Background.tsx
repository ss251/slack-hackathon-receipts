import { AbsoluteFill } from "remotion";
import { C } from "../theme";
// Dead-still wallpaper (motion rule: the background never moves).
export const Background: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(120% 120% at 50% 0%, ${C.aubergine} 0%, ${C.bg0} 70%)` }}>
    <AbsoluteFill style={{ background: `radial-gradient(55% 45% at 82% 12%, rgba(46,182,125,0.10), transparent 70%)` }} />
  </AbsoluteFill>
);
