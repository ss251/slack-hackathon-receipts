import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SANS } from "../theme";
export const Wordmark: React.FC<{ tagline?: string; sub?: string }> = ({ tagline, sub }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 200, mass: 0.8 }, durationInFrames: 26 });
  const y = interpolate(s, [0, 1], [30, 0]); const op = interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const tOp = interpolate(f, [16, 32], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <div style={{ transform: `translateY(${y}px)`, opacity: op }}>
        <div style={{ fontSize: 120 }}>🧾</div>
        <div style={{ color: C.ink, fontFamily: SANS, fontSize: 96, fontWeight: 850, letterSpacing: -2, marginTop: 4 }}>Receipts</div>
      </div>
      {tagline && <div style={{ opacity: tOp, marginTop: 26, color: C.greenLt, fontFamily: SANS, fontSize: 34, fontWeight: 700, maxWidth: 1200, textAlign: "center" }}>{tagline}</div>}
      {sub && <div style={{ opacity: tOp, marginTop: 14, color: C.muted, fontFamily: SANS, fontSize: 24, fontWeight: 500 }}>{sub}</div>}
    </AbsoluteFill>
  );
};
