import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const glow = 0.5 + 0.5 * Math.sin(f / 55);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(150deg, ${C.bg0} 0%, ${C.bg1} 55%, ${C.aubergine} 120%)` }}>
      <AbsoluteFill style={{
        background: `radial-gradient(60% 55% at 78% 18%, rgba(46,182,125,${0.16 * glow}), transparent 70%),
                     radial-gradient(50% 50% at 15% 88%, rgba(97,31,105,0.35), transparent 70%)`,
      }} />
    </AbsoluteFill>
  );
};
