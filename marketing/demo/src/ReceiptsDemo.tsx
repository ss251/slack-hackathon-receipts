import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Background } from "./components/Background";
import { BrowserShot } from "./components/BrowserShot";
import { Caption } from "./components/Caption";
import { Wordmark } from "./components/Wordmark";
import { C, SANS, MONO } from "./theme";

// a scene wrapper that fades in/out over the persistent background
const Scene: React.FC<{ from: number; dur: number; children: React.ReactNode }> = ({ from, dur, children }) => (
  <Sequence from={from} durationInFrames={dur}>
    <SceneFade dur={dur}>{children}</SceneFade>
  </Sequence>
);
const SceneFade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 12, dur - 12, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const mono = (t: string) => <span style={{ fontFamily: MONO, color: C.greenLt }}>{t}</span>;

export const ReceiptsDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.bg0 }}>
      <Background />

      {/* 1 · INTRO 0–100 */}
      <Scene from={0} dur={100}>
        <Wordmark tagline="Ends the argument with the actual prior decision." />
      </Scene>

      {/* 2 · THE PROBLEM 100–380 (280) */}
      <Scene from={100} dur={280}>
        <BrowserShot src="01_channel.png" dur={280} fx={0.5} fy={0.82} zoom={1.16} />
        <Caption kicker="The problem" start={8}
          headline={<>Decisions get made in Slack — then <span style={{ color: C.greenLt }}>re-litigated.</span></>}
          sub={<>“wait didn’t we already settle this? I can never find where these decisions land 😩”</>} />
      </Scene>

      {/* 3 · HERO RECEIPT 380–760 (380) */}
      <Scene from={380} dur={380}>
        <BrowserShot src="02_receipt.png" dur={380} fx={0.5} fy={0.72} zoom={1.24} />
        <Caption kicker="Summon it" start={10}
          headline={<>{mono("@Receipts")} did we decide to drop Node 18?</>}
          sub={<>It finds the real decision — <b style={{ color: C.ink }}>verbatim, attributed, one jump-link away.</b></>} />
      </Scene>

      {/* 4 · FAQ DEFLECT 760–1030 (270) */}
      <Scene from={760} dur={270}>
        <BrowserShot src="03_deflect.png" dur={270} fx={0.5} fy={0.74} zoom={1.22} />
        <Caption kicker="Repeat questions" start={8}
          headline={<>The answer — and <span style={{ color: C.greenLt }}>how many times it’s been asked.</span></>}
          sub={<>Stop re-answering. It deflects the FAQ before a human has to.</>} />
      </Scene>

      {/* 5 · ACL — FINDS NOTHING 1030–1270 (240) */}
      <Scene from={1030} dur={240}>
        <BrowserShot src="04_acl.png" dur={240} fx={0.5} fy={0.82} zoom={1.2} />
        <Caption kicker="Permission-aware" start={8}
          headline={<>Ask about a channel you’re not in → <span style={{ color: C.greenLt }}>it finds nothing.</span></>}
          sub={<>Because it searches <b style={{ color: C.ink }}>as you</b> — Slack’s Real-Time Search API, live.</>} />
      </Scene>

      {/* 6 · ACL — THE REVEAL 1270–1570 (300) */}
      <Scene from={1270} dur={300}>
        <BrowserShot src="05_leadership.png" dur={300} fx={0.5} fy={0.78} zoom={1.24} />
        <Caption kicker="The kicker" start={10}
          headline={<>The decision was <span style={{ color: C.greenLt }}>right there</span> — in #leadership.</>}
          sub={<>A channel you’re not in. A bot indexing all of Slack would’ve leaked it. <b style={{ color: C.ink }}>Receipts can’t.</b></>} />
      </Scene>

      {/* 7 · CLOSE 1570–1790 (220) */}
      <Scene from={1570} dur={220}>
        <Wordmark tagline="Permission-aware. No index. Just receipts."
          sub="Built on Slack’s Real-Time Search API" />
      </Scene>
    </AbsoluteFill>
  );
};

