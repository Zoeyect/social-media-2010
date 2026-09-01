import assert from "node:assert/strict";
import { createServer } from "vite";

const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });

try {
  const repositoryModule = await vite.ssrLoadModule("/src/data/publicTwitterRepository.ts");
  const mockModule = await vite.ssrLoadModule("/src/data/mockPublicTwitterRepository.ts");
  const fixturesModule = await vite.ssrLoadModule("/src/data/publicTwitterFixtures.ts");
  const publicState = await vite.ssrLoadModule("/src/state/publicTwitterState.ts");
  const seed = await vite.ssrLoadModule("/src/data/sessionSeedContent.ts");
  const timeline = await vite.ssrLoadModule("/src/data/sessionTimeline.ts");

  const repository = mockModule.createMockPublicTwitterRepository();
  const first = await repository.listApprovedPosts();
  const second = await repository.listApprovedPosts();
  assert.deepEqual(first, second, "mock reads must be deterministic");
  assert.notStrictEqual(first, second, "each mock read must return an independent immutable array");
  assert.equal(Object.isFrozen(first), true, "mock result arrays must be immutable");
  assert.equal(fixturesModule.PUBLIC_TWITTER_MOCK_DTOS.length, 3, "P1a must retain a tiny three-record fixture set");
  assert.deepEqual((await repository.listApprovedPosts({ limit: 2 })).map(post => post.id), first.slice(0, 2).map(post => post.id), "limit must preserve stable order");
  assert.deepEqual(await repository.listApprovedPosts({ limit: 0 }), [], "zero limit must return no records");
  assert.ok(first.every(post => post.origin === "public_visitor"), "all repository records must retain public provenance");
  assert.ok(first.every(post => post.body.length <= 140), "mock bodies must honor the current UTF-16 limit");
  assert.ok(first.every(post => !post.publicHandle.startsWith("@")), "domain handles must omit the rendering @ prefix");
  assert.ok(first.every(post => {
    const time = Date.parse(post.simulated2010CreatedAt);
    return time >= repositoryModule.PUBLIC_TWITTER_SIMULATED_START_MS
      && time <= repositoryModule.PUBLIC_TWITTER_SIMULATED_END_MS;
  }), "mock timestamps must stay within the canonical experience window");

  const baseDto = fixturesModule.PUBLIC_TWITTER_MOCK_DTOS[0];
  const invalid = [
    { ...baseDto, id: "" },
    { ...baseDto, public_handle: "@" },
    { ...baseDto, body: "x".repeat(141) },
    { ...baseDto, simulated_2010_created_at: "not-a-date" },
    { ...baseDto, origin: "seed" },
    { ...baseDto, moderation_status: "pending" },
    { ...baseDto, deleted_at: "2026-08-01T05:00:00.000Z" },
  ];
  assert.deepEqual(repositoryModule.mapApprovedPublicTwitterPostDtos(invalid), [], "invalid, non-approved, and deleted DTOs must be filtered");

  const fixtureIds = new Set(first.map(post => post.id));
  assert.ok(seed.SESSION_SEED_CONTENT.twitter.every(tweet => !fixtureIds.has(tweet.id)), "public fixtures must not enter canonical Twitter seed");
  assert.ok(timeline.TWITTER_LIVE_ACTIVITY_POOL.every(event => !fixtureIds.has(event.payload.post.id)), "public fixtures must not enter the realtime scheduler");

  const loaded = publicState.publicTwitterStateTransition(publicState.initialPublicTwitterState, { type: "LOAD_SUCCEEDED", posts: first });
  assert.equal(loaded.status, "ready");
  assert.deepEqual(loaded.approvedPosts, first);
  const reset = publicState.publicTwitterStateTransition(loaded, { type: "RESET_PUBLIC_SESSION" });
  assert.deepEqual(reset, publicState.initialPublicTwitterState, "public session reset must clear only local public-layer state");
  assert.equal(reset.publicHandle, null);
  assert.deepEqual(reset.selectedArchiveIds, []);

  console.log("Public Visitor Twitter P1a checks: PASS");
} finally {
  await vite.close();
}
