import { Img, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { WINDOW, IMG, CHROME_H, D, zoomTo, lerpRect, type Rect } from "../layout";

export interface CamKey { at: number; rect: Rect }          // camera keyframes (demo-local frames)
export interface ContentKey { at: number; src: string }      // which screenshot is visible from `at`
export interface Ring { from: number; to: number; rect: Rect } // highlight ring over a source-px rect

const XFADE = 12;

export const DemoWindow: React.FC<{ cams: CamKey[]; contents: ContentKey[]; rings?: Ring[] }> = ({ cams, contents, rings = [] }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // camera: spring-lerp between rect keyframes (damping 200 — smooth, no overshoot)
  let i = 0; while (i < cams.length - 1 && f >= cams[i + 1].at) i++;
  const a = cams[i], b = cams[Math.min(i + 1, cams.length - 1)];
  const seg = Math.max(1, b.at - a.at);
  const p = a === b ? 1 : spring({ frame: f - a.at, fps, config: { damping: 200 }, durationInFrames: Math.min(seg, 55) });
  const { s, tx, ty } = zoomTo(lerpRect(a.rect, b.rect, Math.min(1, p)));

  return (
    <div style={{ position: "absolute", left: WINDOW.x, top: WINDOW.y, width: WINDOW.w, height: WINDOW.h,
      borderRadius: 16, overflow: "hidden", background: "#0f0a12",
      boxShadow: "0 40px 90px -20px rgba(0,0,0,0.65), 0 8px 24px rgba(0,0,0,0.4)",
      outline: "1px solid rgba(255,255,255,0.08)", outlineOffset: -1 }}>
      {/* chrome bar with the REAL client URL */}
      <div style={{ height: CHROME_H, display: "flex", alignItems: "center", gap: 8, padding: "0 16px",
        background: "#221226", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ width: 12, height: 12, borderRadius: 99, background: "#ff5f57" }} />
        <div style={{ width: 12, height: 12, borderRadius: 99, background: "#febc2e" }} />
        <div style={{ width: 12, height: 12, borderRadius: 99, background: "#28c840" }} />
        <div style={{ margin: "0 auto", height: 24, borderRadius: 8, background: "#160a18",
          color: "#a892b3", fontSize: 13, display: "flex", alignItems: "center",
          padding: "0 14px", fontFamily: "ui-monospace, Menlo, monospace" }}>
          🔒&nbsp; app.slack.com/client/E0BF8LD0BC1/C0BG177PNE4
        </div>
        <div style={{ width: 36 }} />
      </div>
      {/* camera viewport */}
      <div style={{ position: "relative", width: IMG.w, height: IMG.h, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: "0 0" }}>
          {contents.map((c, idx) => {
            const next = contents[idx + 1];
            const on = idx === 0 ? 1 : interpolate(f, [c.at, c.at + XFADE], [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const off = next ? interpolate(f, [next.at, next.at + XFADE], [1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
            const op = Math.min(on, off);
            if (op <= 0) return null;
            return <Img key={c.src} src={staticFile(c.src)}
              style={{ position: "absolute", top: 0, left: 0, width: IMG.w, height: IMG.h, opacity: op }} />;
          })}
          {/* highlight rings live in image space so they track the camera */}
          {rings.map((r, k) => {
            if (f < r.from || f > r.to) return null;
            const inOp = interpolate(f, [r.from, r.from + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const pulse = 0.35 + 0.2 * Math.sin((f - r.from) / 7);
            return <div key={k} style={{ position: "absolute",
              left: r.rect.x * D - 6, top: r.rect.y * D - 6,
              width: r.rect.w * D + 12, height: r.rect.h * D + 12,
              border: `2px solid rgba(66,212,146,${(0.55 + pulse * 0.4) * inOp})`,
              borderRadius: 8, boxShadow: `0 0 22px rgba(46,182,125,${pulse * inOp})` }} />;
          })}
        </div>
      </div>
    </div>
  );
};
