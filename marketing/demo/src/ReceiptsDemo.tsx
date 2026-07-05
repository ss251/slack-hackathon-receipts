import { Audio, staticFile, interpolate } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Intro } from "./scenes/Intro";
import { Demo } from "./scenes/Demo";
import { Outro } from "./scenes/Outro";

export const INTRO = 100, DEMO = 1360, OUTRO = 170, T = 16;
export const TOTAL = INTRO + DEMO + OUTRO - 2 * T; // 1598

const timing = springTiming({ config: { damping: 200 }, durationInFrames: T, durationRestThreshold: 0.001 });

export const ReceiptsDemo: React.FC = () => (
  <>
    <Audio src={staticFile("bed.mp3")}
      volume={(f) => interpolate(f, [0, 24, TOTAL - 60, TOTAL - 6], [0, 0.16, 0.16, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={INTRO}><Intro /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={DEMO} premountFor={30}><Demo /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={OUTRO}><Outro /></TransitionSeries.Sequence>
    </TransitionSeries>
  </>
);
