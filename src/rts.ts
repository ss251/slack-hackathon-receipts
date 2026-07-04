// Receipts — Real-Time Search (RTS) module.
// The engine: assistant.search.context, run AS a specific user (permission-scoped),
// in KEYWORD mode (never phrase the query as a natural-language question — that flips
// RTS into the non-deterministic semantic path).
//
// Docs: https://docs.slack.dev/reference/methods/assistant.search.context/
// The load-bearing property: "the search is performed on behalf of the authenticated
// user, ensuring that only content the user has access to is returned." That ACL scoping
// is what makes Receipts impossible for a generic bot over a stale index.

export interface RtsHit {
  text: string;
  channelId?: string;
  channelName?: string;
  author?: string;
  authorId?: string;
  ts?: string;
  permalink?: string;
  isAuthorBot?: boolean;
}

export interface RtsResult {
  ok: boolean;
  error?: string;
  hits: RtsHit[];
  raw: unknown; // kept so the spike can learn the exact response shape
}

/**
 * Search the workspace AS the token owner. Pass a USER token (xoxp-) for permission-scoped
 * search across public + private channels the user can see. (In production we may instead use
 * a bot token + action_token from the summon event — see the spike's identity check.)
 */
export async function searchContext(opts: {
  token: string;            // xoxp- user token (spike/MVP) or xoxb- + actionToken (prod)
  query: string;            // KEYWORD query — the rare distinctive topic token(s)
  actionToken?: string;     // required when token is a bot token
  channelTypes?: string[];  // default: public + private
  limit?: number;
}): Promise<RtsResult> {
  const body: Record<string, unknown> = {
    query: opts.query,
    channel_types: opts.channelTypes ?? ["public_channel", "private_channel"],
    limit: opts.limit ?? 8,
  };
  if (opts.actionToken) body.action_token = opts.actionToken;

  const res = await fetch("https://slack.com/api/assistant.search.context", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  });

  const raw = await res.json().catch(() => ({ ok: false, error: "non_json_response" }));

  if (!raw || raw.ok !== true) {
    return { ok: false, error: raw?.error ?? `http_${res.status}`, hits: [], raw };
  }

  // Response shape is learned during the spike; normalize defensively. RTS returns results
  // under results.messages (each with text, channel, user, ts, permalink, is_author_bot).
  const messages =
    raw?.results?.messages ??
    raw?.messages ??
    raw?.results ??
    [];

  const hits: RtsHit[] = (Array.isArray(messages) ? messages : []).map((m: any) => ({
    text: m?.text ?? m?.message?.text ?? "",
    channelId: m?.channel?.id ?? m?.channel_id ?? m?.channel,
    channelName: m?.channel?.name ?? m?.channel_name,
    author: m?.user?.name ?? m?.username ?? m?.user,
    authorId: m?.user?.id ?? m?.user_id,
    ts: m?.ts ?? m?.message?.ts,
    permalink: m?.permalink ?? m?.message?.permalink,
    isAuthorBot: m?.is_author_bot ?? false,
  }));

  return { ok: true, hits, raw };
}
