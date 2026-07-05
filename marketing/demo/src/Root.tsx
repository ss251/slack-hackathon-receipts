import { Composition } from "remotion";
import { ReceiptsDemo, TOTAL } from "./ReceiptsDemo";
import { FPS, W, H } from "./theme";
export const RemotionRoot: React.FC = () => (
  <Composition id="ReceiptsDemo" component={ReceiptsDemo} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
