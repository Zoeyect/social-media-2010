import assert from "node:assert/strict";
import { createServer } from "vite";

const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });

try {
  const repositoryModule = await vite.ssrLoadModule("/src/data/publicTwitterRepository.ts");
  const mockModule = await vite.ssrLoadModule("/src/data/mockPublicTwitterRepository.ts");
  const fixturesModule = await vite.ssrLoadModule("/src/data/publicTwitterFixtures.ts");
  const publicState = await vite.ssrLoadModule("/src/state/publicTwitterState.ts");
  const composition = await vite.ssrLoadModule("/src/state/twitterTimelineComposition.ts");
  const seed = await vite.ssrLoadModule("/src/data/sessionSeedContent.ts");
  const timeline = await vite.ssrLoadModule("/src/data/sessionTimeline.ts");
  const submissionMock = await vite.ssrLoadModule("/src/data/mockPublicTwitterSubmissionRepository.ts");
  const twitter = await vite.ssrLoadModule("/src/state/twitterState.ts");

  const repository = mockModule.createMockPublicTwitterRepository();
  const first = await repository.listApprovedPosts();
  const second = await repository.listApprovedPosts();
  assert.deepEqual(first, second, "mock reads must be deterministic");
  assert.notStrictEqual(first, second, "each mock read must return an independent immutable array");
  assert.equal(Object.isFrozen(first), true, "mock result arrays must be immutable");
  assert.equal(fixturesModule.PUBLIC_TWITTER_MOCK_DTOS.length, 6, "P1b must retain a small mock fixture set");
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

  const selectedA = composition.selectPublicVisitorPostIds(first, "experience-a");
  const selectedAAgain = composition.selectPublicVisitorPostIds(first, "experience-a");
  const selectedB = composition.selectPublicVisitorPostIds(first, "experience-b");
  assert.deepEqual(selectedA, selectedAAgain, "same experience must select the same public sample");
  assert.equal(selectedA.length, 3, "public sample must be capped at three");
  assert.equal(new Set(selectedA).size, selectedA.length, "public sample must not duplicate records");
  assert.notDeepEqual(selectedA, selectedB, "different experience seeds may select a different sample");

  const canonical = Array.from({ length: 13 }, (_, index) => ({
    id: `canonical-${index}`, tweet: { id: `canonical-${index}`, displayName: "Canonical", text: `${index}`, timestamp: "12:00 AM", contentStatus: "HOLD-fictional", origin: "seed" }, retweetActivity: false, effectiveAt: 1000 - index,
  }));
  const composed = composition.composeTwitterTimelineActivities(canonical, first, selectedA);
  assert.equal(composed[0].source, "canonical", "public visitor content must never be first");
  assert.deepEqual(composed.filter(item => item.source === "canonical").map(item => item.id), canonical.map(item => item.id), "composition must preserve canonical relative order");
  assert.deepEqual(composed.filter(item => item.source === "public_visitor").map(item => item.id), selectedA, "composition must use stored selected IDs");
  assert.ok(composed.filter(item => item.source === "public_visitor").every(item => !item.capabilities.detail && !item.capabilities.profile && !item.capabilities.reply && !item.capabilities.retweet && item.capabilities.favorite), "P1b visitor capabilities must remain explicit and narrow");
  const visitorPositions = composed.map((item, index) => item.source === "public_visitor" ? index : -1).filter(index => index >= 0);
  assert.ok(visitorPositions.slice(1).every((position, index) => position - visitorPositions[index] >= 4), "visitor rows must retain at least three canonical rows between them");
  assert.deepEqual(composition.composeTwitterTimelineActivities(canonical, [], []), canonical.map(item => ({ ...item, source: "canonical", capabilities: { detail: true, profile: true, reply: true, retweet: true, favorite: true } })), "empty/error public data must leave canonical composition intact");

  const loaded = publicState.publicTwitterStateTransition(publicState.initialPublicTwitterState, { type: "LOAD_SUCCEEDED", posts: first, selectedArchiveIds: selectedA });
  assert.equal(loaded.status, "ready");
  assert.deepEqual(loaded.approvedPosts, first);
  assert.deepEqual(loaded.selectedArchiveIds, selectedA);
  const revealed = publicState.publicTwitterStateTransition(loaded, { type: "TOGGLE_ARCHIVE_ACTIONS", archiveId: selectedA[0] });
  assert.equal(revealed.revealedArchiveId, selectedA[0]);
  const reset = publicState.publicTwitterStateTransition(loaded, { type: "RESET_PUBLIC_SESSION" });
  assert.deepEqual(reset, publicState.initialPublicTwitterState, "public session reset must clear only local public-layer state");
  assert.equal(reset.publicHandle, null);
  assert.deepEqual(reset.selectedArchiveIds, []);

  assert.equal(publicState.initialPublicTwitterState.publicHandle, null, "public handle must start empty and independent of Hero identity");
  assert.equal(publicState.normalizePublicTwitterHandle(" @Coffee_Run "), "coffee_run");
  for (const invalidHandle of ["", "two words", "bad!", "abcdefghijklmnop"]) {
    assert.equal(publicState.normalizePublicTwitterHandle(invalidHandle), null, `invalid public handle must be rejected: ${invalidHandle}`);
  }

  let local = twitter.createInitialTwitterState("Hero Name");
  local = twitter.twitterStateTransition(local, { type: "BEGIN_NEW_TWEET" });
  local = twitter.twitterStateTransition(local, { type: "EDIT_COMPOSER", value: "same local and public body" });
  const localMoment = Date.parse("2010-10-20T00:08:00-07:00");
  local = twitter.twitterStateTransition(local, { type: "SUBMIT_NEW_TWEET", displayName: "Hero Name", createdAt: localMoment, timestamp: "12:08 AM" });
  const localTweet = local.timeline.find(tweet => tweet.id === "twitter-user-tweet-1");
  assert.ok(localTweet, "ordinary local Tweet must exist before any public submission");
  assert.equal(local.currentView, "timeline");
  assert.equal(local.composerKind, null);
  assert.equal(publicState.initialPublicTwitterState.submissionStatus, "idle", "ordinary Send must not create public intent");

  const snapshot = Object.freeze({ localTweetId: localTweet.id, body: localTweet.text, simulated2010CreatedAt: new Date(localMoment).toISOString(), simulatedElapsedMs: 360_000, idempotencyKey: "00000000-0000-4000-8000-000000000001" });
  let publicFlow = publicState.publicTwitterStateTransition(loaded, { type: "BEGIN_PUBLIC_INTENT", snapshot });
  assert.equal(publicFlow.submissionStatus, "awaiting_handle");
  assert.equal(publicFlow.publicHandle, null, "Hero identity must never initialize public handle");
  assert.equal(publicFlow.pendingSubmission.body, localTweet.text);
  assert.equal(publicFlow.pendingSubmission.simulated2010CreatedAt, new Date(localTweet.createdAt).toISOString());
  publicFlow = publicState.publicTwitterStateTransition(publicFlow, { type: "SET_PUBLIC_HANDLE", publicHandle: "coffee_run" });
  assert.equal(publicFlow.submissionStatus, "idle");

  const writeRepository = submissionMock.createMockPublicTwitterSubmissionRepository();
  const payload = { publicHandle: publicFlow.publicHandle, body: snapshot.body, simulated2010CreatedAt: snapshot.simulated2010CreatedAt, simulatedElapsedMs: snapshot.simulatedElapsedMs, idempotencyKey: snapshot.idempotencyKey };
  writeRepository.failNextSubmission();
  await assert.rejects(writeRepository.submit(payload), /Mock public submission failed/);
  assert.ok(local.timeline.some(tweet => tweet.id === localTweet.id), "public failure must not remove the local Tweet");
  const failed = publicState.publicTwitterStateTransition(publicFlow, { type: "SUBMISSION_FAILED", error: "Mock public submission failed" });
  assert.equal(failed.pendingSubmission.idempotencyKey, snapshot.idempotencyKey, "retry must retain idempotency key");
  const accepted = await writeRepository.submit(payload);
  assert.deepEqual(await writeRepository.submit(payload), accepted, "same key and payload must return the same result");
  await assert.rejects(writeRepository.submit({ ...payload, body: "conflict" }), /conflicting/);
  const nextSnapshot = { ...snapshot, localTweetId: "twitter-user-tweet-2", idempotencyKey: "00000000-0000-4000-8000-000000000002" };
  assert.notEqual(nextSnapshot.idempotencyKey, snapshot.idempotencyKey, "new Tweet must receive a new idempotency key");
  assert.deepEqual(composition.composeTwitterTimelineActivities(canonical, first, selectedA).filter(item => item.source === "public_visitor").map(item => item.id), selectedA, "P1c submission must not enter or alter the approved P1b sample");
  const resetSubmission = publicState.publicTwitterStateTransition(failed, { type: "RESET_PUBLIC_SESSION" });
  assert.equal(resetSubmission.publicHandle, null);
  assert.equal(resetSubmission.submissionStatus, "idle");
  assert.equal(resetSubmission.pendingSubmission, null);

  console.log("Public Visitor Twitter P1c checks: PASS");
} finally {
  await vite.close();
}
