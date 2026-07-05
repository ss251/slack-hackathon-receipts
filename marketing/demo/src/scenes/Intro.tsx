import { AbsoluteFill } from "remotion";
import { Background } from "../components/Background";
import { Wordmark } from "../components/Wordmark";
export const Intro: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Wordmark tagline="Ends the argument with the actual prior decision." />
  </AbsoluteFill>
);
