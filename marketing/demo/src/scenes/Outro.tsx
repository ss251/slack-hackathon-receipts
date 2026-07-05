import { AbsoluteFill } from "remotion";
import { Background } from "../components/Background";
import { Wordmark } from "../components/Wordmark";
export const Outro: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Wordmark tagline="Permission-aware. No index. Just receipts."
      sub="Built on Slack’s Real-Time Search API"
      cta="Slack Agent Builder Challenge · 2026" />
  </AbsoluteFill>
);
