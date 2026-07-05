import { Composition } from "remotion";
import { ReceiptsDemo } from "./ReceiptsDemo";
import { FPS, W, H } from "./theme";
export const RemotionRoot: React.FC = () => (
  <Composition id="ReceiptsDemo" component={ReceiptsDemo}
    durationInFrames={1790} fps={FPS} width={W} height={H} />
);
