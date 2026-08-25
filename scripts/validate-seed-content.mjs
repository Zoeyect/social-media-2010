import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createServer } from "vite";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const vite = await createServer({ root: projectRoot, server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });

try {
  const messages = await vite.ssrLoadModule("/src/state/messagesState.ts");
  const messagesBadge = await vite.ssrLoadModule("/src/state/messagesBadgeState.ts");
  const facebook = await vite.ssrLoadModule("/src/state/facebookState.ts");
  const twitter = await vite.ssrLoadModule("/src/state/twitterState.ts");
  const foursquare = await vite.ssrLoadModule("/src/state/foursquareState.ts");
  const tumblr = await vite.ssrLoadModule("/src/state/tumblrState.ts");
  const flickr = await vite.ssrLoadModule("/src/state/flickrState.ts");
  const instagram = await vite.ssrLoadModule("/src/state/instagramState.ts");
  const seedContent = await vite.ssrLoadModule("/src/data/sessionSeedContent.ts");
  const sessionTimeline = await vite.ssrLoadModule("/src/data/sessionTimeline.ts");
  const scheduler = await vite.ssrLoadModule("/src/state/deviceEventScheduler.ts");

  const seed = seedContent.SESSION_SEED_CONTENT;
  const timelineDefinitions = sessionTimeline.SESSION_TIMELINE_EVENTS;
  const expectedTimeline = [
    ["initial-sms-mom-home-yet", 60, "initialSMS"],
    ["facebook-jack-request", 150, "facebookJackRequest"],
    ["facebook-june-message", 270, "facebookJuneMessage"],
    ["twitter-eva-school-tomorrow", 300, "twitterBackgroundTweet"],
    ["twitter-late-night-update", 390, "twitterBackgroundTweet"],
    ["foursquare-friend-checkin", 510, "foursquareActivity"],
    ["tumblr-background-post", 630, "tumblrBackgroundPost"],
    ["twitter-nora-homework", 690, "twitterBackgroundTweet"],
  ];
  assert.deepEqual(
    timelineDefinitions.map(event => [event.id, event.atElapsedSeconds, event.type]),
    expectedTimeline,
    "cross-app timeline IDs, timing, and types must remain frozen",
  );
  const scheduledTimeline = scheduler.scheduleDeviceEvents([], sessionTimeline.buildSessionTimelineEvents());
  const scheduledTwice = scheduler.scheduleDeviceEvents(scheduledTimeline, sessionTimeline.buildSessionTimelineEvents());
  assert.equal(scheduledTwice.length, expectedTimeline.length, "timeline registration must remain exactly once");
  assert.deepEqual(scheduledTwice.map(event => event.id), expectedTimeline.map(([id]) => id));
  let catchUpQueue = scheduledTimeline;
  const caughtUpIds = [];
  while (scheduler.nextDueDeviceEvent(catchUpQueue, 15 * 60 * 1_000)) {
    const due = scheduler.nextDueDeviceEvent(catchUpQueue, 15 * 60 * 1_000);
    caughtUpIds.push(due.id);
    catchUpQueue = scheduler.removeDeviceEvent(catchUpQueue, due.id);
  }
  assert.deepEqual(caughtUpIds, expectedTimeline.map(([id]) => id), "elapsed-time catch-up must expose every event once without interaction");
  assert.equal(scheduledTimeline.some(event => event.sourceApp === "flickr"), false, "Flickr seed photos must not have scheduler duplicates");
  assert.equal(scheduledTimeline.some(event => event.payload?.kind === "initial-sms" && event.payload.sender === "Dad"), false, "Dad seed must not be registered as an arrival");

  let messagesA = messages.createInitialMessagesState();
  const messagesB = messages.createInitialMessagesState();
  assert.notStrictEqual(messagesA.messages, messagesB.messages, "sessions must clone the Messages seed array");
  assert.notStrictEqual(messagesA.messages[0], messagesB.messages[0], "sessions must clone the Dad seed record");
  assert.deepEqual(messagesA.messages.map(message => [message.sender, message.status, message.origin]), [["Dad", "unread", "seed"]]);
  assert.equal(messagesA.messages[0].timestamp, "5:48 PM");
  assert.equal(messagesA.messages.some(message => message.sender === "Mom"), false, "Mom must not exist before the live event");
  let unreadDadBadges = messagesBadge.createInitialMessagesBadgeState();
  assert.deepEqual(unreadDadBadges, ["dad-dinner-tonight"]);
  messagesA = messages.messagesStateTransition(messagesA, { type: "RECEIVE_MESSAGE", id: "mom-home-yet", conversationId: "mom", sender: "Mom", message: "Home yet?", timestamp: "12:03 AM" });
  unreadDadBadges = messagesBadge.messagesBadgeStateTransition(unreadDadBadges, { type: "ADD_UNREAD", messageId: "mom-home-yet" });
  assert.equal(unreadDadBadges.length, 2, "Mom arrival must stack on an unread Dad badge");
  assert.equal(messagesA.messages.at(-1).origin, "live");
  assert.equal(messagesB.messages.length, 1, "one session mutation must not leak into another");

  let readDadState = messages.createInitialMessagesState();
  let readDadBadges = messagesBadge.createInitialMessagesBadgeState();
  readDadState = messages.messagesStateTransition(readDadState, { type: "OPEN_CONVERSATION", conversationId: "dad" });
  readDadBadges = messagesBadge.messagesBadgeStateTransition(readDadBadges, { type: "MARK_READ", messageId: "dad-dinner-tonight" });
  assert.equal(readDadBadges.length, 0);
  assert.equal(readDadState.messages.find(message => message.id === "dad-dinner-tonight").status, "read");
  readDadState = messages.messagesStateTransition(readDadState, { type: "EDIT_DRAFT", value: "Maybe later" });
  readDadState = messages.messagesStateTransition(readDadState, { type: "SEND" });
  assert.equal(readDadState.messages.at(-1).conversationId, "dad");
  assert.equal(readDadState.messages.at(-1).origin, "live");
  assert.equal(readDadState.momReply, "none", "Dad replies must not schedule a scripted response");
  readDadState = messages.messagesStateTransition(readDadState, { type: "RECEIVE_MESSAGE", id: "mom-home-yet", conversationId: "mom", sender: "Mom", message: "Home yet?", timestamp: "12:03 AM" });
  readDadBadges = messagesBadge.messagesBadgeStateTransition(readDadBadges, { type: "ADD_UNREAD", messageId: "mom-home-yet" });
  assert.equal(readDadBadges.length, 1, "Mom must be the only badge after Dad was read");
  messagesA = messages.messagesStateTransition(messagesA, { type: "RESET_RUNTIME" });
  unreadDadBadges = messagesBadge.messagesBadgeStateTransition(unreadDadBadges, { type: "RESET" });
  assert.deepEqual(messagesA.messages.map(message => [message.sender, message.status]), [["Dad", "unread"]], "Messages reset must restore the unread seed baseline");
  assert.deepEqual(unreadDadBadges, ["dad-dinner-tonight"]);
  assert.deepEqual(seed.messages.map(message => [message.sender, message.status]), [["Dad", "unread"]], "Messages runtime actions must not mutate the seed source");

  let facebookA = facebook.createInitialFacebookState("Zoey");
  const facebookB = facebook.createInitialFacebookState("Alex");
  assert.equal(facebookA.friendRequestState, "none");
  assert.equal(facebookA.juneMessageState, "none");
  assert.ok(facebookA.inboxThreads.every(thread => thread.origin === "seed" && thread.status === "read"));
  facebookA = facebook.facebookStateTransition(facebookA, { type: "DELIVER_JACK_REQUEST" });
  facebookA = facebook.facebookStateTransition(facebookA, { type: "DELIVER_JUNE_MESSAGE" });
  facebookA = facebook.facebookStateTransition(facebookA, { type: "DELIVER_JACK_REQUEST" });
  facebookA = facebook.facebookStateTransition(facebookA, { type: "DELIVER_JUNE_MESSAGE" });
  assert.equal(facebookA.friendRequestState, "pending");
  assert.equal(facebookA.juneMessageState, "unread");
  assert.equal(facebookA.inboxThreads.filter(thread => thread.id === "june-live-message").length, 1, "June live message must deliver once");
  assert.ok(facebookA.feed.every(item => item.origin === "seed"), "older Facebook feed content must remain seed content");
  assert.ok(facebookA.inboxThreads.filter(thread => thread.id !== "june-live-message").every(thread => thread.origin === "seed"), "older Facebook inbox content must survive live delivery");
  assert.equal(facebookB.friendRequestState, "none");
  assert.equal(facebookB.inboxThreads.some(thread => thread.id === "june-live-message"), false);

  let facebookAccept = facebook.facebookStateTransition(facebookA, { type: "ACCEPT_JACK" });
  assert.equal(facebookAccept.friendRequestState, "accepted");
  assert.deepEqual(facebookAccept.friends, [{ id: "jack", name: "Jack" }], "accepting Jack must add one session-local friend record");
  facebookAccept = facebook.facebookStateTransition(facebookAccept, { type: "DELIVER_JACK_REQUEST" });
  assert.equal(facebookAccept.friends.length, 1, "Jack request must not recreate or duplicate after acceptance");
  let facebookIgnore = facebook.facebookStateTransition(
    facebook.facebookStateTransition(facebook.createInitialFacebookState("Zoey"), { type: "DELIVER_JACK_REQUEST" }),
    { type: "IGNORE_JACK" },
  );
  assert.equal(facebookIgnore.friendRequestState, "ignored");
  assert.deepEqual(facebookIgnore.friends, [], "ignoring Jack must not add a friend record");
  facebookIgnore = facebook.facebookStateTransition(facebookIgnore, { type: "DELIVER_JACK_REQUEST" });
  assert.equal(facebookIgnore.friendRequestState, "ignored", "ignored request must not be recreated");

  let facebookPlayability = facebook.facebookStateTransition(facebookA, { type: "OPEN_JUNE_MESSAGE" });
  assert.equal(facebookPlayability.juneMessageState, "read", "opening June must mark only the live June message read");
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "EDIT_JUNE_REPLY", value: "Still awake." });
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "SUBMIT_JUNE_REPLY", displayName: "Zoey" });
  assert.equal(facebookPlayability.juneMessageState, "replied");
  assert.deepEqual(facebookPlayability.juneReplies, [{ id: "facebook-june-reply-1", author: "Zoey", text: "Still awake." }]);
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "OPEN_FEED_ITEM", itemId: "jack-movie", scrollPosition: 96 });
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "BEGIN_COMMENT", itemId: "jack-movie" });
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "EDIT_COMMENT", value: "I thought so too." });
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "SUBMIT_COMMENT", displayName: "Zoey" });
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "TOGGLE_LIKE", itemId: "jack-movie" });
  assert.deepEqual(facebookPlayability.comments, [{ id: "facebook-comment-1", itemId: "jack-movie", author: "Zoey", text: "I thought so too." }]);
  assert.deepEqual(facebookPlayability.likedItemIds, ["jack-movie"]);
  assert.equal(facebookPlayability.juneMessageState, "replied", "Feed interaction must not mutate June state");
  assert.deepEqual(facebookPlayability.friends, [], "Feed and message interaction must not mutate Friends state");
  assert.equal(facebookPlayability.scrollPosition, 96, "Facebook playability mutations must preserve feed scroll state");

  const twitterSeed = seed.twitter;
  assert.equal(twitterSeed.length, 9, "Twitter must start with nine seed tweets");
  assert.deepEqual(
    twitterSeed.map(tweet => tweet.timestamp),
    ["11:58 PM", "11:53 PM", "11:41 PM", "11:26 PM", "11:03 PM", "10:47 PM", "10:05 PM", "9:12 PM", "8:30 PM"],
    "Twitter seed must remain newest-first",
  );
  assert.equal(twitterSeed.filter(tweet => tweet.contentType === "manual-retweet").length, 2);
  assert.equal(twitterSeed.filter(tweet => tweet.contentType === "celebrity-discussion").length, 1);
  assert.equal(twitterSeed.filter(tweet => tweet.contentType === "ordinary").length, 5);
  assert.ok(twitterSeed.every(tweet => tweet.origin === "seed" && tweet.timestampProvenance === "CURATED"));
  assert.ok(twitterSeed.filter(tweet => tweet.contentType === "manual-retweet").every(tweet => (
    tweet.sourceTweetProvenance === "HOLD"
    && tweet.retweetWrapperProvenance === "CURATED"
    && tweet.sourceTweet?.handle
    && tweet.sourceTweet?.sourceDate
    && tweet.sourceTweet?.sourceUrl
  )), "mixed Twitter provenance metadata must remain intact");

  let twitterState = twitter.createInitialTwitterState("Zoey");
  assert.equal(twitterState.activeTab, "timeline");
  assert.equal(twitterState.currentView, "timeline");
  assert.equal(twitterState.revealedTweetId, null);
  twitterState = twitter.twitterStateTransition(twitterState, { type: "SET_SCROLL_POSITION", scrollPosition: 64 });
  for (const tab of ["mentions", "messages", "search", "more"]) {
    twitterState = twitter.twitterStateTransition(twitterState, { type: "SHOW_TAB", tab });
    assert.equal(twitterState.activeTab, tab);
    assert.equal(twitterState.scrollPosition, 64, "secondary tab shells must not reset Timeline scroll");
  }
  twitterState = twitter.twitterStateTransition(twitterState, { type: "SHOW_TAB", tab: "timeline" });
  twitterState = twitter.twitterStateTransition(twitterState, { type: "TOGGLE_TWEET_ACTIONS", tweetId: "still-awake" });
  assert.equal(twitterState.revealedTweetId, "still-awake", "timeline swipe state must reveal one tweet action pane");
  twitterState = twitter.twitterStateTransition(twitterState, { type: "SHOW_TAB", tab: "mentions" });
  twitterState = twitter.twitterStateTransition(twitterState, { type: "SHOW_TAB", tab: "timeline" });
  assert.equal(twitterState.revealedTweetId, "still-awake", "tweet action state must survive tab switching");
  twitterState = twitter.twitterStateTransition(twitterState, { type: "TOGGLE_TWEET_ACTIONS", tweetId: "still-awake" });
  assert.equal(twitterState.revealedTweetId, null);
  twitterState = twitter.twitterStateTransition(twitterState, { type: "BEGIN_NEW_TWEET" });
  assert.equal(twitterState.currentView, "composer");
  assert.equal(twitterState.composerKind, "new");
  twitterState = twitter.twitterStateTransition(twitterState, { type: "EDIT_REPLY", value: "draft from top compose" });
  assert.equal(twitterState.replyDraft, "draft from top compose");
  twitterState = twitter.twitterStateTransition(twitterState, { type: "CANCEL_REPLY" });
  assert.equal(twitterState.currentView, "timeline");
  assert.equal(twitterState.composerKind, null);
  const scheduledTwitterPosts = timelineDefinitions
    .filter(event => event.payload?.kind === "twitter-post")
    .map(event => event.payload.post);
  assert.equal(scheduledTwitterPosts.length, 3, "Twitter must be the most active social app with three live additions");
  const liveCountsBySocialApp = timelineDefinitions
    .filter(event => event.sourceApp !== "messages")
    .reduce((counts, event) => ({ ...counts, [event.sourceApp]: (counts[event.sourceApp] ?? 0) + 1 }), {});
  assert.ok(liveCountsBySocialApp.twitter > liveCountsBySocialApp.facebook);
  assert.ok(Object.entries(liveCountsBySocialApp).every(([app, count]) => app === "twitter" || count < liveCountsBySocialApp.twitter));
  const evaEvent = timelineDefinitions.find(event => event.id === "twitter-eva-school-tomorrow");
  assert.equal(evaEvent?.atElapsedSeconds, 300);
  assert.deepEqual(evaEvent?.payload?.kind === "twitter-post" ? evaEvent.payload.post : null, {
    id: "eva-school-tomorrow",
    displayName: "Eva",
    text: "ugh I really don't want to go to school tomorrow",
    timestamp: "12:07 AM",
  });
  assert.ok(timelineDefinitions.filter(event => event.sourceApp === "twitter").every(event => event.deliveryPolicy === "internal"));
  assert.equal([...twitterState.timeline, ...scheduledTwitterPosts].filter(tweet => /Apple/i.test(tweet.text)).length, 1, "Twitter seed plus live timeline may contain only one Apple-event reference");
  assert.ok(scheduledTwitterPosts.every(post => !twitterState.timeline.some(tweet => tweet.id === post.id)), "no live Twitter post may exist in seed");
  assert.equal(twitterState.timeline.some(tweet => scheduledTwitterPosts.some(post => post.id === tweet.id)), false, "live Twitter content must not be seeded");
  let retweetOrderState = twitter.twitterStateTransition(twitter.createInitialTwitterState("Zoey"), {
    type: "TOGGLE_RETWEET",
    tweetId: "still-awake",
    retweetedBy: "Zoey",
    retweetActionTimestamp: 100,
  });
  retweetOrderState = twitter.twitterStateTransition(retweetOrderState, {
    type: "TOGGLE_RETWEET",
    tweetId: "class-tomorrow",
    retweetedBy: "Zoey",
    retweetActionTimestamp: 200,
  });
  assert.deepEqual(
    retweetOrderState.retweetActivities.map(activity => activity.id),
    ["user-retweet:class-tomorrow", "user-retweet:still-awake"],
    "new current-user Retweet activities must prepend in action order",
  );
  retweetOrderState = twitter.twitterStateTransition(retweetOrderState, {
    type: "TOGGLE_RETWEET",
    tweetId: "class-tomorrow",
    retweetedBy: "Zoey",
    retweetActionTimestamp: 300,
  });
  assert.deepEqual(retweetOrderState.retweetActivities.map(activity => activity.id), ["user-retweet:still-awake"], "unretweet must preserve unrelated Retweet activity");
  twitterState = twitter.twitterStateTransition(twitterState, { type: "OPEN_TWEET", tweetId: "still-awake", scrollPosition: 144 });
  twitterState = twitter.twitterStateTransition(twitterState, { type: "SHOW_TAB", tab: "messages" });
  assert.equal(twitterState.currentView, "tweetDetail");
  assert.equal(twitterState.selectedTweetId, "still-awake", "tab switching must retain the selected Tweet route");
  twitterState = twitter.twitterStateTransition(twitterState, { type: "SHOW_TAB", tab: "timeline" });
  twitterState = twitter.twitterStateTransition(twitterState, { type: "BEGIN_REPLY", tweetId: "still-awake" });
  assert.equal(twitterState.currentView, "composer");
  assert.equal(twitterState.composerKind, "reply");
  assert.equal(twitterState.replyDraft, "@june ", "Reply composer must prefill the target username approximation");
  twitterState = twitter.twitterStateTransition(twitterState, { type: "EDIT_REPLY", value: "x".repeat(141) });
  assert.equal(twitterState.replyDraft.length, 140, "Twitter replies must enforce the 140-character limit in state");
  twitterState = twitter.twitterStateTransition(twitterState, { type: "CANCEL_REPLY" });
  assert.equal(twitterState.replyComposerTweetId, null);
  assert.equal(twitterState.replyDraft, "");
  twitterState = twitter.twitterStateTransition(twitterState, { type: "BEGIN_REPLY", tweetId: "still-awake" });
  twitterState = twitter.twitterStateTransition(twitterState, { type: "EDIT_REPLY", value: "still here" });
  twitterState = twitter.twitterStateTransition(twitterState, { type: "BACK_TO_TIMELINE" });
  assert.equal(twitterState.replyDraft, "still here", "reply draft must survive navigation and suspension-equivalent retained state");
  twitterState = twitter.twitterStateTransition(twitterState, { type: "SUBMIT_REPLY", displayName: "Zoey" });
  assert.deepEqual(twitterState.replies, [{ id: "twitter-reply-1", targetTweetId: "still-awake", displayName: "Zoey", text: "still here" }]);
  twitterState = twitter.twitterStateTransition(twitterState, {
    type: "TOGGLE_RETWEET",
    tweetId: "still-awake",
    retweetedBy: "Zoey",
    retweetActionTimestamp: 1_287_552_360_000,
  });
  twitterState = twitter.twitterStateTransition(twitterState, { type: "TOGGLE_FAVORITE", tweetId: "still-awake" });
  assert.deepEqual(twitterState.retweetedTweetIds, ["still-awake"]);
  assert.deepEqual(twitterState.retweetActivities, [{
    id: "user-retweet:still-awake",
    sourceTweetId: "still-awake",
    retweetedBy: "Zoey",
    originalTweetTimestamp: "11:58 PM",
    retweetActionTimestamp: 1_287_552_360_000,
  }], "current-user Retweet must create one stable timeline activity without rewriting the source tweet");
  assert.equal(twitterState.timeline.find(tweet => tweet.id === "still-awake")?.displayName, "June");
  assert.equal(twitterState.timeline.find(tweet => tweet.id === "still-awake")?.timestamp, "11:58 PM");
  assert.deepEqual(twitterState.favoriteTweetIds, ["still-awake"]);
  assert.equal(twitterState.replies.length, 1, "Reply, Retweet, and Favorite state must remain independent");
  twitterState = twitter.twitterStateTransition(twitterState, { type: "SET_SCROLL_POSITION", scrollPosition: 144 });
  scheduledTwitterPosts.forEach(post => {
    twitterState = twitter.twitterStateTransition(twitterState, { type: "DELIVER_TIMELINE_TWEET", tweet: post });
    twitterState = twitter.twitterStateTransition(twitterState, { type: "DELIVER_TIMELINE_TWEET", tweet: post });
    assert.equal(twitterState.timeline.filter(tweet => tweet.id === post.id).length, 1);
  });
  assert.equal(twitterState.scrollPosition, 144, "live delivery must not force-reset the current Twitter scroll position");
  assert.equal(twitterState.timeline[0].id, "nora-homework", "newest live activity must sort above earlier live and seed items");
  assert.deepEqual(
    twitterState.timeline.slice(0, 3).map(tweet => tweet.id),
    ["nora-homework", "late-night-line", "eva-school-tomorrow"],
    "live Twitter activity must remain newest-first",
  );
  assert.deepEqual(twitterState.retweetedTweetIds, ["still-awake"], "live delivery must preserve Retweet state");
  assert.equal(twitterState.retweetActivities.length, 1, "live delivery must preserve exactly one current-user Retweet activity");
  assert.deepEqual(twitterState.favoriteTweetIds, ["still-awake"], "live delivery must preserve Favorite state");
  assert.equal(twitterState.replies.length, 1, "live delivery must preserve user replies");
  twitterState = twitter.twitterStateTransition(twitterState, {
    type: "TOGGLE_RETWEET",
    tweetId: "still-awake",
    retweetedBy: "Zoey",
    retweetActionTimestamp: 1_287_552_480_000,
  });
  assert.deepEqual(twitterState.retweetedTweetIds, []);
  assert.deepEqual(twitterState.retweetActivities, [], "unretweet must remove only the related session activity");
  assert.equal(twitterState.timeline.filter(tweet => tweet.id === "still-awake").length, 1, "unretweet must preserve the original tweet");
  assert.deepEqual(twitterState.favoriteTweetIds, ["still-awake"], "unretweet must preserve Favorite state");
  assert.equal(twitterState.replies.length, 1, "unretweet must preserve replies");
  twitterState = twitter.twitterStateTransition(twitterState, {
    type: "TOGGLE_RETWEET",
    tweetId: "still-awake",
    retweetedBy: "Zoey",
    retweetActionTimestamp: 1_287_552_540_000,
  });
  assert.equal(twitterState.retweetActivities.length, 1, "re-retweet must restore one stable activity without duplicates");
  assert.equal(twitterState.retweetActivities[0].id, "user-retweet:still-awake");
  const twitterReset = twitter.twitterStateTransition(twitterState, { type: "RESET", displayName: "Alex" });
  assert.equal(twitterReset.favoriteTweetIds.length, 0);
  assert.equal(twitterReset.retweetedTweetIds.length, 0);
  assert.equal(twitterReset.retweetActivities.length, 0);
  assert.equal(twitterReset.replies.length, 0);
  assert.equal(twitterReset.replyComposerTweetId, null);
  assert.equal(twitterReset.replyDraft, "");
  assert.equal(twitterReset.activeTab, "timeline");
  assert.equal(twitterReset.currentView, "timeline");
  assert.equal(twitterReset.composerKind, null);
  assert.equal(twitterReset.revealedTweetId, null);
  assert.equal(twitterReset.timeline.length, 9);
  assert.ok(scheduledTwitterPosts.every(post => !twitterReset.timeline.some(tweet => tweet.id === post.id)), "session reset must remove every live Twitter addition");
  assert.equal(twitterReset.timeline.find(tweet => tweet.id === "late-night-user").displayName, "Alex");

  let foursquareState = foursquare.createInitialFoursquareState();
  assert.equal(foursquareState.points, 0);
  assert.deepEqual(foursquareState.checkIns, {});
  assert.deepEqual(foursquareState.shoutDrafts, {});
  assert.equal(foursquareState.mayorState, "otherUser");
  assert.deepEqual(foursquareState.earnedBadges, []);
  assert.equal(foursquareState.socialActivities.length, 1);
  const activity = { id: "live-checkin", message: "June checked in." };
  foursquareState = foursquare.foursquareStateTransition(foursquareState, { type: "DELIVER_SOCIAL_ACTIVITY", activity });
  foursquareState = foursquare.foursquareStateTransition(foursquareState, { type: "DELIVER_SOCIAL_ACTIVITY", activity });
  assert.equal(foursquareState.socialActivities.length, 2);
  assert.equal(foursquareState.unreadActivityCount, 1);
  assert.equal(foursquareState.points, 0, "ambient activity must not mutate user gameplay state");
  assert.deepEqual(foursquareState.checkIns, {}, "ambient activity must not check in the session owner");
  assert.equal(foursquareState.mayorState, "otherUser");
  assert.deepEqual(foursquareState.earnedBadges, []);

  let foursquarePlayability = foursquare.foursquareStateTransition(foursquareState, { type: "OPEN_VENUE", venueId: "night-owl", scrollPosition: 73 });
  foursquarePlayability = foursquare.foursquareStateTransition(foursquarePlayability, { type: "OPEN_TIP", venueId: "night-owl", tipId: "night-owl-tip" });
  assert.equal(foursquarePlayability.selectedTipId, "night-owl-tip", "a venue Tip must open without changing user gameplay");
  assert.equal(foursquarePlayability.points, 0);
  assert.equal(foursquarePlayability.scrollPosition, 73);
  foursquarePlayability = foursquare.foursquareStateTransition(foursquarePlayability, { type: "EDIT_CHECK_IN_SHOUT", venueId: "night-owl", value: "late coffee" });
  foursquarePlayability = foursquare.foursquareStateTransition(foursquarePlayability, {
    type: "CHECK_IN",
    venueId: "night-owl",
    checkedInBy: "Zoey",
    checkInTimestamp: 1_287_552_600_000,
  });
  assert.deepEqual(foursquarePlayability.checkIns["night-owl"], {
    checkedIn: true,
    checkedInBy: "Zoey",
    checkInTimestamp: 1_287_552_600_000,
    shout: "late coffee",
    pointsAwarded: 1,
  });
  assert.equal(foursquarePlayability.points, 1);
  assert.equal(foursquarePlayability.selectedTipId, "night-owl-tip", "check-in must not close or mutate the selected Tip");
  assert.equal(foursquarePlayability.mayorState, "otherUser", "one check-in must not promote the session owner to Mayor");
  assert.deepEqual(foursquarePlayability.earnedBadges, [], "check-in must not award a badge");
  const afterFirstCheckIn = foursquarePlayability;
  foursquarePlayability = foursquare.foursquareStateTransition(foursquarePlayability, {
    type: "CHECK_IN",
    venueId: "night-owl",
    checkedInBy: "Zoey",
    checkInTimestamp: 1_287_552_660_000,
  });
  assert.strictEqual(foursquarePlayability, afterFirstCheckIn, "duplicate venue check-in must not mutate state or award points");
  foursquarePlayability = foursquare.foursquareStateTransition(foursquarePlayability, { type: "OPEN_VENUE", venueId: "corner-diner", scrollPosition: 73 });
  foursquarePlayability = foursquare.foursquareStateTransition(foursquarePlayability, {
    type: "CHECK_IN",
    venueId: "corner-diner",
    checkedInBy: "Zoey",
    checkInTimestamp: 1_287_552_720_000,
  });
  assert.equal(foursquarePlayability.checkIns["corner-diner"].shout, null, "empty shout must still permit check-in");
  assert.equal(foursquarePlayability.points, 2);
  assert.equal(foursquarePlayability.socialActivities.length, 2, "user check-in must remain separate from ambient seed/live activity");

  let tumblrState = tumblr.createInitialTumblrState();
  assert.ok(tumblrState.posts.every(post => post.origin === "seed"));
  assert.equal(tumblrState.notes.length, 2);
  assert.ok(tumblrState.notes.every(note => note.origin === "seed" && tumblrState.posts.some(post => post.id === note.sourcePostId)), "Tumblr seed Notes must reference existing posts without mutating post objects");
  assert.equal(tumblrState.posts.some(post => post.id === "late-note"), false);
  const livePost = { id: "late-note", type: "text", blog: "latewatch", title: "After midnight", content: "Quiet.", timestamp: "2010-10-20 12:12 AM" };
  tumblrState = tumblr.tumblrStateTransition(tumblrState, { type: "DELIVER_BACKGROUND_POST", post: livePost });
  tumblrState = tumblr.tumblrStateTransition(tumblrState, { type: "DELIVER_BACKGROUND_POST", post: livePost });
  assert.equal(tumblrState.posts.filter(post => post.id === livePost.id).length, 1);
  assert.equal(tumblrState.posts.at(-1).origin, "live");
  assert.equal(seed.tumblr.some(post => post.id === livePost.id), false, "Tumblr live item must not mutate the seed source");

  let tumblrPlayability = tumblr.createInitialTumblrState();
  tumblrPlayability = tumblr.tumblrStateTransition(tumblrPlayability, { type: "OPEN_POST", postId: "sunset-note", dashboardScrollPosition: 82 });
  tumblrPlayability = tumblr.tumblrStateTransition(tumblrPlayability, { type: "TOGGLE_LIKE", postId: "sunset-note", blogName: "Zoey" });
  assert.deepEqual(tumblrPlayability.likedPostIds, ["sunset-note"]);
  assert.deepEqual(tumblrPlayability.notes.at(-1), { id: "user-like:sunset-note", sourcePostId: "sunset-note", blogName: "Zoey", type: "liked", origin: "user" });
  tumblrPlayability = tumblr.tumblrStateTransition(tumblrPlayability, { type: "OPEN_NOTES", postId: "sunset-note" });
  assert.equal(tumblrPlayability.currentView, "notes");
  assert.deepEqual(tumblrPlayability.rebloggedPostIds, [], "opening Notes must not mutate Reblog state");
  tumblrPlayability = tumblr.tumblrStateTransition(tumblrPlayability, { type: "BACK_TO_POST" });
  tumblrPlayability = tumblr.tumblrStateTransition(tumblrPlayability, { type: "OPEN_REBLOG", postId: "sunset-note" });
  tumblrPlayability = tumblr.tumblrStateTransition(tumblrPlayability, { type: "EDIT_REBLOG_TEXT", value: "x".repeat(141) });
  assert.equal(tumblrPlayability.reblogDraft.length, 140, "minimal Reblog text must remain short in reducer state");
  tumblrPlayability = tumblr.tumblrStateTransition(tumblrPlayability, { type: "CANCEL_REBLOG" });
  assert.equal(tumblrPlayability.currentView, "post");
  assert.equal(tumblrPlayability.reblogDraft, "");
  assert.deepEqual(tumblrPlayability.reblogs, [], "cancel must not create a Reblog relation");
  tumblrPlayability = tumblr.tumblrStateTransition(tumblrPlayability, { type: "OPEN_REBLOG", postId: "sunset-note" });
  tumblrPlayability = tumblr.tumblrStateTransition(tumblrPlayability, { type: "EDIT_REBLOG_TEXT", value: "same feeling" });
  tumblrPlayability = tumblr.tumblrStateTransition(tumblrPlayability, { type: "CONFIRM_REBLOG", rebloggedBy: "Zoey", actionTimestamp: 1_287_552_780_000 });
  assert.deepEqual(tumblrPlayability.reblogs, [{
    id: "user-reblog:sunset-note",
    sourcePostId: "sunset-note",
    reblogged: true,
    rebloggedBy: "Zoey",
    optionalUserText: "same feeling",
    actionTimestamp: 1_287_552_780_000,
  }]);
  assert.deepEqual(tumblrPlayability.rebloggedPostIds, ["sunset-note"]);
  assert.equal(tumblrPlayability.posts.find(post => post.id === "sunset-note").blog, "dayonejournal", "Reblog must preserve the source post author/content object");
  assert.equal(tumblrPlayability.likedPostIds.includes("sunset-note"), true, "Reblog must not clear Like");
  assert.equal(tumblrPlayability.notes.filter(note => note.id === "user-reblog:sunset-note").length, 1, "confirmed Reblog must create at most one user Note relation");
  tumblrPlayability = tumblr.tumblrStateTransition(tumblrPlayability, { type: "DELIVER_BACKGROUND_POST", post: livePost });
  assert.equal(tumblrPlayability.reblogs.length, 1, "live delivery must preserve current-user Reblog state");
  assert.equal(tumblrPlayability.dashboardScrollPosition, 82);
  tumblrPlayability = tumblr.tumblrStateTransition(tumblrPlayability, { type: "REMOVE_REBLOG", postId: "sunset-note" });
  assert.deepEqual(tumblrPlayability.rebloggedPostIds, []);
  assert.deepEqual(tumblrPlayability.reblogs, [], "unreblog must remove only the current-user relation");
  assert.equal(tumblrPlayability.likedPostIds.includes("sunset-note"), true, "unreblog must preserve Like");
  assert.equal(tumblrPlayability.notes.some(note => note.id === "user-like:sunset-note"), true, "unreblog must preserve the user Like Note");
  assert.equal(tumblrPlayability.notes.some(note => note.id === "user-reblog:sunset-note"), false);
  assert.equal(tumblrPlayability.posts.filter(post => post.id === "sunset-note").length, 1, "unreblog must preserve the original Dashboard post");
  tumblrPlayability = tumblr.tumblrStateTransition(tumblrPlayability, { type: "OPEN_REBLOG", postId: "sunset-note" });
  tumblrPlayability = tumblr.tumblrStateTransition(tumblrPlayability, { type: "CONFIRM_REBLOG", rebloggedBy: "Zoey", actionTimestamp: 1_287_552_840_000 });
  assert.equal(tumblrPlayability.reblogs.length, 1, "reblogging again must restore one stable relation without duplicates");
  tumblrPlayability = tumblr.tumblrStateTransition(tumblrPlayability, { type: "BACK_TO_DASHBOARD" });
  assert.equal(tumblrPlayability.currentView, "dashboard");
  assert.equal(tumblrPlayability.dashboardScrollPosition, 82, "Back must restore the existing Dashboard scroll position");
  assert.equal(tumblrPlayability.reblogs.length, 1, "Back navigation must preserve Reblog state");

  let flickrA = flickr.createInitialFlickrState();
  const flickrB = flickr.createInitialFlickrState();
  assert.notStrictEqual(flickrA.photos, flickrB.photos);
  assert.notStrictEqual(flickrA.photos[0], flickrB.photos[0]);
  assert.ok(flickrA.photos.every(photo => photo.origin === "seed" && photo.timestamp < "2010-10-20 12:02 AM"));
  assert.deepEqual(flickrA.commentsState.map(comment => [comment.text, comment.origin]), [["Nice shot", "seed"]], "existing Flickr comments must normalize into session-local seed records");
  assert.ok(flickrA.sets.length <= 2 && flickrA.sets.every(set => set.photoIds.every(photoId => flickrA.photos.some(photo => photo.id === photoId))), "Flickr Sets must reference existing photo IDs without duplicate photo objects");
  flickrA = flickr.flickrStateTransition(flickrA, { type: "TOGGLE_FAVORITE", photoId: flickrA.photos[0].id });
  assert.equal(flickrA.favoritePhotoIds.length, 1);
  assert.equal(flickrB.favoritePhotoIds.length, 0, "Flickr Favorite state must remain session-local");
  flickrA = flickr.flickrStateTransition(flickrA, { type: "OPEN_PHOTO", photoId: "sunset-brooklyn", origin: { view: "photostream" }, photostreamScrollPosition: 91 });
  flickrA = flickr.flickrStateTransition(flickrA, { type: "OPEN_COMMENTS" });
  flickrA = flickr.flickrStateTransition(flickrA, { type: "EDIT_COMMENT", value: "Still beautiful." });
  flickrA = flickr.flickrStateTransition(flickrA, { type: "SUBMIT_COMMENT", author: "Zoey" });
  assert.deepEqual(flickrA.commentsState.at(-1), {
    id: "flickr-user-comment-1",
    photoId: "sunset-brooklyn",
    author: "Zoey",
    text: "Still beautiful.",
    origin: "user",
  });
  assert.deepEqual(seed.flickr[0].comments, ["Nice shot"], "user comment must not mutate the Flickr seed definition");
  assert.deepEqual(flickrA.favoritePhotoIds, ["sunset-brooklyn"], "commenting must not alter Favorite state");
  assert.equal(flickrA.photostreamScrollPosition, 91);
  flickrA = flickr.flickrStateTransition(flickrA, { type: "BACK_TO_PHOTO" });
  flickrA = flickr.flickrStateTransition(flickrA, { type: "BACK_FROM_PHOTO" });
  assert.equal(flickrA.currentView, "photostream");
  assert.equal(flickrA.photostreamScrollPosition, 91, "photo opened from Photostream must restore its scroll position");
  flickrA = flickr.flickrStateTransition(flickrA, { type: "SHOW_SETS" });
  flickrA = flickr.flickrStateTransition(flickrA, { type: "OPEN_SET", setId: "late-night" });
  const setMembershipBeforePhoto = [...flickrA.sets.find(set => set.id === "late-night").photoIds];
  flickrA = flickr.flickrStateTransition(flickrA, { type: "OPEN_PHOTO", photoId: "platform", origin: { view: "set", setId: "late-night" } });
  assert.equal(flickrA.currentView, "photo");
  assert.deepEqual(flickrA.photoNavigationOrigin, { view: "set", setId: "late-night" });
  flickrA = flickr.flickrStateTransition(flickrA, { type: "BACK_FROM_PHOTO" });
  assert.equal(flickrA.currentView, "set", "photo opened from a Set must return to that Set");
  assert.equal(flickrA.currentSetId, "late-night");
  assert.deepEqual(flickrA.sets.find(set => set.id === "late-night").photoIds, setMembershipBeforePhoto, "navigation and comments must not alter Set membership");
  assert.deepEqual(flickrA.favoritePhotoIds, ["sunset-brooklyn"]);
  assert.equal(flickrA.commentsState.filter(comment => comment.origin === "user").length, 1);

  let instagramState = instagram.createInitialInstagramState();
  assert.deepEqual({ photos: instagramState.photos.length, followers: instagramState.followers, following: instagramState.following }, { photos: 0, followers: 0, following: 0 });
  assert.equal(instagramState.currentView, "feed");
  assert.deepEqual(instagramState.draft, { source: null, filter: null });
  instagramState = instagram.instagramStateTransition(instagramState, { type: "BEGIN_FIRST_PHOTO" });
  assert.equal(instagramState.currentView, "source");
  instagramState = instagram.instagramStateTransition(instagramState, { type: "SELECT_SOURCE", source: "dev-fixture" });
  assert.equal(instagramState.currentView, "filter");
  assert.deepEqual(instagramState.draft, { source: "dev-fixture", filter: "Original" });
  instagramState = instagram.instagramStateTransition(instagramState, { type: "CANCEL_FIRST_PHOTO" });
  assert.equal(instagramState.currentView, "feed");
  assert.deepEqual(instagramState.draft, { source: null, filter: null }, "cancel must discard the first-photo draft");
  instagramState = instagram.instagramStateTransition(instagramState, { type: "BEGIN_FIRST_PHOTO" });
  instagramState = instagram.instagramStateTransition(instagramState, { type: "SELECT_SOURCE", source: "dev-fixture" });
  instagramState = instagram.instagramStateTransition(instagramState, { type: "SELECT_FILTER", filter: "Original" });
  instagramState = instagram.instagramStateTransition(instagramState, { type: "CONTINUE_TO_SHARE" });
  assert.equal(instagramState.currentView, "share");
  instagramState = instagram.instagramStateTransition(instagramState, { type: "POST_FIRST_PHOTO", owner: "Zoey", createdAt: 1_287_552_900_000 });
  assert.deepEqual(instagramState.photos, [{
    id: "instagram-first-photo",
    owner: "Zoey",
    source: "dev-fixture",
    filter: "Original",
    createdAt: 1_287_552_900_000,
    origin: "user",
  }]);
  assert.deepEqual({ followers: instagramState.followers, following: instagramState.following }, { followers: 0, following: 0 });
  const instagramAfterSecondAttempt = instagram.instagramStateTransition(instagramState, { type: "BEGIN_FIRST_PHOTO" });
  assert.strictEqual(instagramAfterSecondAttempt, instagramState, "v0.2 must allow at most one user photo");
  instagramState = instagram.instagramStateTransition(instagramState, { type: "SET_SCROLL_POSITION", scrollPosition: 37 });
  instagramState = instagram.instagramStateTransition(instagramState, { type: "SHOW_PROFILE" });
  instagramState = instagram.instagramStateTransition(instagramState, { type: "SHOW_FEED" });
  assert.equal(instagramState.photos.length, 1, "navigation must retain the current-session photo");
  assert.equal(instagramState.scrollPosition, 37);
  assert.deepEqual(seed.instagram.photos, [], "first-photo activity must not mutate the Instagram seed baseline");

  const tumblrZoey = tumblrPlayability;
  let facebookZoey = facebook.createInitialFacebookState("Zoey");
  facebookZoey = facebook.facebookStateTransition(facebookZoey, { type: "TOGGLE_LIKE", itemId: facebookZoey.feed[0].id });
  facebookZoey = facebook.facebookStateTransition(facebookZoey, { type: "DELIVER_JACK_REQUEST" });
  facebookZoey = facebook.facebookStateTransition(facebookZoey, { type: "ACCEPT_JACK" });
  facebookZoey = facebook.facebookStateTransition(facebookZoey, { type: "DELIVER_JUNE_MESSAGE" });
  facebookZoey = facebook.facebookStateTransition(facebookZoey, { type: "OPEN_JUNE_MESSAGE" });
  facebookZoey = facebook.facebookStateTransition(facebookZoey, { type: "EDIT_JUNE_REPLY", value: "yes" });
  facebookZoey = facebook.facebookStateTransition(facebookZoey, { type: "SUBMIT_JUNE_REPLY", displayName: "Zoey" });
  facebookZoey = facebook.facebookStateTransition(facebookZoey, { type: "BEGIN_COMMENT", itemId: facebookZoey.feed[0].id });
  facebookZoey = facebook.facebookStateTransition(facebookZoey, { type: "EDIT_COMMENT", value: "Zoey session comment" });
  facebookZoey = facebook.facebookStateTransition(facebookZoey, { type: "SUBMIT_COMMENT", displayName: "Zoey" });
  const facebookAlex = facebook.facebookStateTransition(facebookZoey, { type: "RESET", displayName: "Alex" });
  const flickrAlex = flickr.flickrStateTransition(flickrA, { type: "RESET" });
  const tumblrAlex = tumblr.tumblrStateTransition(tumblrZoey, { type: "RESET" });
  const foursquareAlex = foursquare.foursquareStateTransition(foursquarePlayability, { type: "RESET" });
  const instagramAlex = instagram.instagramStateTransition(instagramState, { type: "RESET" });
  assert.deepEqual(facebookAlex.likedItemIds, []);
  assert.equal(facebookAlex.friendRequestState, "none");
  assert.deepEqual(facebookAlex.friends, []);
  assert.equal(facebookAlex.juneMessageState, "none");
  assert.deepEqual(facebookAlex.juneReplies, []);
  assert.equal(facebookAlex.juneReplyDraft, "");
  assert.deepEqual(facebookAlex.comments, []);
  assert.equal(facebookAlex.commentComposerItemId, null);
  assert.equal(facebookAlex.commentDraft, "");
  assert.equal(facebookAlex.inboxThreads.some(thread => thread.id === "june-live-message"), false);
  assert.equal(facebookAlex.feed.find(item => item.id === "owner-late").author, "Alex");
  assert.deepEqual(flickrAlex.favoritePhotoIds, []);
  assert.equal(flickrAlex.currentView, "photostream");
  assert.equal(flickrAlex.selectedPhotoId, null);
  assert.equal(flickrAlex.currentSetId, null);
  assert.equal(flickrAlex.photostreamScrollPosition, 0);
  assert.equal(flickrAlex.commentsState.filter(comment => comment.origin === "user").length, 0);
  assert.deepEqual(flickrAlex.commentsState.map(comment => [comment.text, comment.origin]), [["Nice shot", "seed"]]);
  assert.deepEqual(tumblrAlex.likedPostIds, []);
  assert.deepEqual(tumblrAlex.rebloggedPostIds, []);
  assert.deepEqual(tumblrAlex.reblogs, []);
  assert.equal(tumblrAlex.reblogDraft, "");
  assert.equal(tumblrAlex.currentView, "dashboard");
  assert.equal(tumblrAlex.selectedPostId, null);
  assert.equal(tumblrAlex.dashboardScrollPosition, 0);
  assert.equal(tumblrAlex.notes.filter(note => note.origin === "user").length, 0);
  assert.equal(tumblrAlex.notes.filter(note => note.origin === "seed").length, 2);
  assert.equal(tumblrAlex.posts.some(post => post.id === "late-note"), false, "new session must remove live Tumblr additions and restore seed Dashboard baseline");
  assert.deepEqual(foursquareAlex.checkIns, {});
  assert.deepEqual(foursquareAlex.shoutDrafts, {});
  assert.equal(foursquareAlex.points, 0);
  assert.equal(foursquareAlex.selectedTipId, null);
  assert.equal(foursquareAlex.socialActivities.length, 1, "new session must restore the seeded ambient baseline and remove live/user mutations");
  assert.deepEqual(instagramAlex.photos, []);
  assert.equal(instagramAlex.currentView, "feed");
  assert.equal(instagramAlex.selectedPhotoId, null);
  assert.equal(instagramAlex.scrollPosition, 0);
  assert.deepEqual(instagramAlex.draft, { source: null, filter: null });
  assert.deepEqual({ followers: instagramAlex.followers, following: instagramAlex.following }, { followers: 0, following: 0 });

  const seedSource = await readFile(resolve(projectRoot, "src/data/sessionSeedContent.ts"), "utf8");
  const twitterContainerSource = await readFile(resolve(projectRoot, "src/device/TwitterContainer.tsx"), "utf8");
  assert.doesNotMatch(seedSource, /DeviceAudio|deviceEventScheduler|smsNotification/, "seed definitions must not depend on delivery systems");
  assert.ok(["Timeline", "Mentions", "Messages", "Search", "More"].every(label => twitterContainerSource.includes(`"${label}"`)), "Twitter must expose the five period tab destinations");
  assert.match(twitterContainerSource, /twitter-tweet-action-row/, "Twitter must render the swipe-revealed action row");
  assert.match(twitterContainerSource, /twitter-avatar-fixture/, "Twitter cells must not leave the avatar column visually empty");
  assert.doesNotMatch(twitterContainerSource, /Quote Tweet|Explore|Spaces|Notifications/, "Twitter IA must not introduce later navigation/features");
  assert.ok(Object.isFrozen(seed) && Object.isFrozen(seed.messages) && Object.isFrozen(seed.twitter), "seed definitions must remain immutable");

  console.log("Historical seed-content state checks: PASS");
} finally {
  await vite.close();
}
