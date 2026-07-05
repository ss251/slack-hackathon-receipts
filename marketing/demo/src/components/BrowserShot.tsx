import { AbsoluteFill, Img, staticFile, interpolate, Easing, useCurrentFrame } from "remotion";
// A screenshot inside window chrome, with a slow zoom toward a focus point (fx,fy in 0..1).
// Reads its own Sequence-local frame, so the zoom restarts per scene.
export const BrowserShot: React.FC<{
  src: string; dur: number; fx?: number; fy?: number; zoom?: number;
}> = ({ src, dur, fx = 0.5, fy = 0.6, zoom = 1.18 }) => {
  const local = useCurrentFrame();
  const winW = 1620, winH = 900;
  const scale = interpolate(local, [0, dur], [1.0, zoom], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const tx = interpolate(local, [0, dur], [0, (0.5 - fx) * winW * (zoom - 1)], { extrapolateRight: "clamp" });
  const ty = interpolate(local, [0, dur], [0, (0.5 - fy) * winH * (zoom - 1)], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{
        width: winW, height: winH, borderRadius: 18, overflow: "hidden",
        boxShadow: "0 40px 120px -30px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.06)",
        background: "#0f0a12",
      }}>
        <div style={{ height: 40, background: "#241726", display: "flex", alignItems: "center", padding: "0 16px", gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: 99, background: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: 99, background: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: 99, background: "#28c840" }} />
          <div style={{ marginLeft: 14, height: 22, flex: 1, maxWidth: 520, borderRadius: 7, background: "#1a1020",
            color: "#9c8aa6", fontSize: 12, display: "flex", alignItems: "center", paddingLeft: 12, fontFamily: "monospace" }}>
            receipts-hackathon.enterprise.slack.com
          </div>
        </div>
        <div style={{ width: winW, height: winH - 40, overflow: "hidden" }}>
          <Img src={staticFile(src)} style={{
            width: winW, transformOrigin: "center top",
            transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
          }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
