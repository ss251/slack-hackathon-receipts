import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FAMILY } from "../theme";

export const Wordmark: React.FC<{ tagline: string; sub?: string; cta?: string }> = ({ tagline, sub, cta }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: f, fps, config: { damping: 14 }, durationInFrames: 30 });        // lively logo pop
  const rise = spring({ frame: f - 6, fps, config: { damping: 200 }, durationInFrames: 26 });   // smooth text
  const op1 = interpolate(f, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op2 = interpolate(f, [14, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op3 = interpolate(f, [24, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <div style={{ fontSize: 108, transform: `scale(${0.7 + 0.3 * pop})` }}>🧾</div>
      <div style={{ fontFamily: FAMILY, fontSize: 92, fontWeight: 700, letterSpacing: "-3px", color: C.ink,
        marginTop: 8, opacity: op1, transform: `translateY(${interpolate(rise, [0, 1], [24, 0])}px)` }}>Receipts</div>
      <div style={{ fontFamily: FAMILY, fontSize: 34, fontWeight: 600, color: C.greenLt, marginTop: 22,
        opacity: op2, maxWidth: 1200 }}>{tagline}</div>
      {sub && <div style={{ fontFamily: FAMILY, fontSize: 24, fontWeight: 400, color: C.sub, marginTop: 14, opacity: op3 }}>{sub}</div>}
      {cta && <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 21, color: C.muted, marginTop: 34,
        opacity: op3, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 10, padding: "10px 22px" }}>{cta}</div>}
    </AbsoluteFill>
  );
};
