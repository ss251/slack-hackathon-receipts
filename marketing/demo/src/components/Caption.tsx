import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SANS } from "../theme";
// Lower-third: green kicker + white headline (+ optional sub). Fades/slides in at `start`.
export const Caption: React.FC<{
  kicker: string; headline: React.ReactNode; sub?: React.ReactNode; start?: number; end?: number;
}> = ({ kicker, headline, sub, start = 6, end }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f - start, fps, config: { damping: 200, mass: 0.6 }, durationInFrames: 20 });
  const y = interpolate(s, [0, 1], [26, 0]);
  const op = interpolate(f, [start, start + 10], [0, 1], { extrapolateRight: "clamp" });
  const outOp = end ? interpolate(f, [end - 12, end], [1, 0], { extrapolateLeft: "clamp" }) : 1;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", opacity: op * outOp }}>
      <div style={{ height: 360, background: "linear-gradient(to top, rgba(10,5,12,0.92), rgba(10,5,12,0.55) 45%, transparent)" }} />
      <div style={{ position: "absolute", left: 150, right: 150, bottom: 96, transform: `translateY(${y}px)` }}>
        <div style={{ color: C.greenLt, fontFamily: SANS, fontSize: 22, fontWeight: 800, letterSpacing: 6, textTransform: "uppercase" }}>{kicker}</div>
        <div style={{ color: C.ink, fontFamily: SANS, fontSize: 54, fontWeight: 800, lineHeight: 1.1, letterSpacing: -0.5, marginTop: 12, maxWidth: 1400 }}>{headline}</div>
        {sub && <div style={{ color: C.muted, fontFamily: SANS, fontSize: 27, fontWeight: 500, lineHeight: 1.35, marginTop: 14, maxWidth: 1300 }}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};
