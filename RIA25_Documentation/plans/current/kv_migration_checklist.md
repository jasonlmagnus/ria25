# Vercel KV Migration – Agent Checklist

## Quick Checklist (tick as you go)

1. Provision KV store: [ ☐ ] - See Section 1 below
2. Install KV client & singleton: [ ☐ ] - See Section 2 below
3. Implement key schema & TTL: [ ☐ ] - See Section 3 below
4. Write read‑through helper: [ ☐ ] - See Section 3 below
5. Segment‑level `HSET` writes: [ ☐ ] - See Section 3 below
6. Replace all `fs` cache calls: [ ☐ ] - See Section 3 below
7. Update call‑sites: [ ☐ ] - See Section 4 below
8. Add local fallback: [ ☐ ] - See Section 5 below
9. Add tests: [ ☐ ] - See Section 6 below
10. Instrument & alert: [ ☐ ] - See Section 7 below
11. Deploy & smoke‑test: [ ☐ ] - See Section 8 below
12. Data migration (optional): [ ☐ ] - See Section 9 below
13. Cleanup & document: [ ☐ ] - See Section 10 below

---

## 0 | Prerequisites

- Vercel Pro plan (or higher) – free tier caps at 10 k Redis commands/day.
- Node 18+ runtime.
- Git repo with CI; `main` triggers production deploy.

## 1 | Provision a KV store

| Step    | Instruction                                                                                                   |
| ------- | ------------------------------------------------------------------------------------------------------------- |
| **1.1** | Vercel → _Storage_ → **KV** → _Create store_. Choose nearest region.                                          |
| **1.2** | Copy `KV_REST_API_URL`, `KV_REST_API_TOKEN` (v3 + v4) into Project → **Env Vars** (`production` + `preview`). |
| **1.3** | Add placeholders in `.env.local.example`.                                                                     |

## 2 | Install client & bootstrap

```bash
npm i @vercel/kv
```

```ts
// lib/kvClient.ts
import { kv } from "@vercel/kv";
export default kv; // singleton – reuse pool
```

## 3 | Refactor cache utilities (`cache-utils.ts`)

### 3.1 Key schema & TTL

```ts
export const threadFileKey = (t: string, f: string) => `thread:${t}:file:${f}`; // 90 d TTL
export const threadMetaKey = (t: string) => `thread:${t}:meta`;
```

### 3.2 Read‑through helper

```ts
import kv from "@/lib/kvClient";
export async function getOrLoad<T>(
  key: string,
  loader: () => Promise<T>,
  ttl = 3600
): Promise<T> {
  const cached = await kv.get<T>(key);
  if (cached) return cached;
  const fresh = await loader();
  kv.set(key, fresh, { ex: ttl }).catch(console.error); // fire & forget
  return fresh;
}
```

### 3.3 Segment‑level writes with hashes

```ts
export async function mergeSegmentSlice(
  threadId: string,
  fileId: string,
  segment: string,
  slice: unknown
) {
  const key = threadFileKey(threadId, fileId);
  await kv.hset(key, { [segment]: JSON.stringify(slice) });
  await kv.expire(key, 60 * 60 * 24 * 90);
}
```

### 3.4 Replace FS calls

- `fs.readFile` → `kv.hgetall`
- `fs.writeFile` → `kv.hset` / `kv.set`

## 4 | Update call‑sites

- `utils/openai/retrieval.js` – swap to new helpers.
- API routes (`api/query`, `api/chat-assistant`) – remove fallback when KV present.

## 5 | Local testing (dev fallback)

Add fallback in `lib/kvClient.ts` if no KV env vars – mock Redis or in‑mem map.

## 6 | Tests

| Test               | Goal                                                  |
| ------------------ | ----------------------------------------------------- |
| kv‑persistence     | Two separate function invocations share cached slice. |
| lazy‑load delta    | Second call fetches only new segments.                |
| TTL expiry         | Keys disappear after simulated expiry.                |
| KV outage fallback | Time‑out returns answer without cache.                |

## 7 | Observability & cost guardrails

- Wrap `kv.get`/`kv.set` with timing logs.
- Dashboard: command count, memory usage, p95 latency.
- Alerts: `memory_usage > 80 %` OR `commands/day > 75 %` of plan.
- Upstash: set `max_commands_per_day` to `120000`.

## 8 | Deploy & smoke‑test

1. `git push && vercel --prod`
2. Open two browsers → new chat → hard refresh → verify thread context persists.
3. Check KV metrics: `cache_hit` > 0, p95 latency < 50 ms.

## 9 | Data migration (optional)

```bash
node scripts/migrate-file-cache-to-kv.js   # ports existing /.cache files
```

## 10 | Post‑launch cleanup

- Delete `/cache` dir & disable `fs` writes in CI.
- Add TTL + purge policy to `MAINTENANCE.md`.

---

### Complexity & Rollback

- **Effort**: ~4–6 h for a mid‑level dev.
- **Rollback flag**: set `DISABLE_KV=1` to revert to dev‑mode file cache.

> **Key facts**: Vercel file system is ephemeral; KV (Redis) gives durable, low‑latency, mutable storage needed for smart segment caching.
