import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BAND } from "../layout";
import { C, FAMILY } from "../theme";

export interface Cap { from: number; to: number; kicker: string; headline: React.ReactNode; sub?: React.ReactNode }

const SWAP = 12;

export const CaptionBand: React.FC<{ caps: Cap[] }> = ({ caps }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left: BAND.x, top: BAND.y, width: BAND.w, height: BAND.h }}>
      {caps.map((c, i) => {
        if (f < c.from - 2 || f > c.to + SWAP) return null;
        const enter = spring({ frame: f - c.from, fps, config: { damping: 200 }, durationInFrames: 22 });
        const inOp = interpolate(f, [c.from, c.from + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const outOp = interpolate(f, [c.to - 8, c.to + 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = interpolate(enter, [0, 1], [22, 0]);
        return (
          <div key={i} style={{ position: "absolute", inset: 0, opacity: Math.min(inOp, outOp), transform: `translateY(${y}px)` }}>
            <div style={{ fontFamily: FAMILY, fontSize: 22, fontWeight: 600, letterSpacing: "0.11em",
              textTransform: "uppercase", color: C.green }}>{c.kicker}</div>
            <div style={{ fontFamily: FAMILY, fontSize: 54, fontWeight: 700, letterSpacing: "-1.6px",
              lineHeight: 1.05, color: C.ink, marginTop: 12, maxWidth: 1660 }}>{c.headline}</div>
            {c.sub && <div style={{ fontFamily: FAMILY, fontSize: 27, fontWeight: 400, lineHeight: 1.35,
              color: C.sub, marginTop: 10, maxWidth: 1560 }}>{c.sub}</div>}
          </div>
        );
      })}
    </div>
  );
};
