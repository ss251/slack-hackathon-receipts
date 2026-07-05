import { AbsoluteFill } from "remotion";
import { Background } from "../components/Background";
import { DemoWindow, type CamKey, type ContentKey, type Ring } from "../components/DemoWindow";
import { CaptionBand, type Cap } from "../components/CaptionBand";
import { WIDE, type Rect } from "../layout";
import { C, FAMILY } from "../theme";

// Focus rects in SOURCE pixels (3688×1772), measured off the actual captures.
const P_RECT:   Rect = { x: 1000, y: 1120, w: 1650, h: 380 };  // Leo re-asks + Priya 😩
const H1_RECT:  Rect = { x: 1000, y: 1240, w: 1500, h: 300 };  // the summon, just sent
const REC_RECT: Rect = { x: 1000, y:  980, w: 1650, h: 500 };  // summon + receipt card
const DEF_RECT: Rect = { x: 1000, y:  990, w: 1650, h: 490 };  // migrations summon + card
const ACL_RECT: Rect = { x: 1000, y: 1170, w: 1650, h: 330 };  // analytics summon + "no prior"
const KW_RECT:  Rect = { x:   60, y:   40, w: 3560, h: 1710 }; // kicker wide (see channel name)
const KD_RECT:  Rect = { x: 1000, y: 1249, w: 1097, h: 520 };  // Dana + Marcus only (view ~1245..1772 — fully clear of staging lines)

const cams: CamKey[] = [
  { at: 0,    rect: WIDE },
  { at: 80,   rect: WIDE },      // hold wide
  { at: 250,  rect: P_RECT },    // 80→ push into the re-litigation
  { at: 405,  rect: H1_RECT },   // 250→ follow to the summon
  { at: 690,  rect: REC_RECT },  // 405→ reply arrives; settle on the card
  { at: 900,  rect: DEF_RECT },  // 690→ deflect exchange
  { at: 1100, rect: ACL_RECT },  // 900→ acl exchange
  { at: 1150, rect: KW_RECT },   // 1100→ quick pull-back (new channel context)
  { at: 1360, rect: KD_RECT },   // 1150→ dive onto the hidden decision
];

const contents: ContentKey[] = [
  { at: 0,    src: "01_problem.png" },
  { at: 250,  src: "02_sent.png" },
  { at: 405,  src: "03_receipt.png" },
  { at: 690,  src: "04_deflect.png" },
  { at: 900,  src: "05_acl.png" },
  { at: 1100, src: "06_leadership.png" },
];

const rings: Ring[] = [
  { from: 470,  to: 670,  rect: { x: 1027, y: 1113, w: 1580, h: 326 } }, // receipt card
  { from: 770,  to: 880,  rect: { x: 1027, y: 1305, w: 1200, h: 60 } },  // "asked & answered 3×"
  { from: 1230, to: 1345, rect: { x: 1022, y: 1256, w: 1000, h: 92 } }, // Dana's hidden decision
];

const mono = (t: string) => <span style={{ fontFamily: "ui-monospace, Menlo, monospace", color: C.greenLt, fontSize: 48 }}>{t}</span>;

const caps: Cap[] = [
  { from: 12,   to: 243,  kicker: "The problem",
    headline: <>Decisions get made in Slack — then re-litigated.</>,
    sub: <>“wait didn’t we already settle this? I can never find where these decisions land” — every team, weekly</> },
  { from: 258,  to: 400,  kicker: "Summon it",
    headline: <>{mono("@Receipts")} did we decide to drop Node 18?</>,
    sub: <>Ask in the thread, right where the argument is happening.</> },
  { from: 420,  to: 685,  kicker: "The receipt",
    headline: <>The actual decision — verbatim, attributed, linked.</>,
    sub: <>Quote · author · date · a jump-link to the real message. Receipts, not vibes.</> },
  { from: 702,  to: 895,  kicker: "Repeat questions",
    headline: <>It answers — and counts how often it was asked.</>,
    sub: <>“asked &amp; answered 3×” — the FAQ writes itself instead of a human re-typing it.</> },
  { from: 912,  to: 1095, kicker: "Permission-aware",
    headline: <>A channel you can’t see? It finds nothing.</>,
    sub: <>Receipts searches <b style={{ color: C.ink }}>as you</b> — live, via Slack’s Real-Time Search API.</> },
  { from: 1118, to: 1348, kicker: "The kicker",
    headline: <>It was right there — in a private channel.</>,
    sub: <>A bot that indexes everything would have leaked it. Receipts structurally can’t.</> },
];

export const Demo: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FAMILY }}>
    <Background />
    <DemoWindow cams={cams} contents={contents} rings={rings} />
    <CaptionBand caps={caps} />
  </AbsoluteFill>
);
