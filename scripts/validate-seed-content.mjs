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
  twitterState = twitter.twitterStateTransition(twitterState, { type: "BEGIN_REPLY", tweetId: "still-awake" });
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
  assert.equal(twitterReset.timeline.length, 9);
  assert.ok(scheduledTwitterPosts.every(post => !twitterReset.timeline.some(tweet => tweet.id === post.id)), "session reset must remove every live Twitter addition");
  assert.equal(twitterReset.timeline.find(tweet => tweet.id === "late-night-user").displayName, "Alex");

  let foursquareState = foursquare.createInitialFoursquareState();
  assert.equal(foursquareState.points, 0);
  assert.deepEqual(foursquareState.checkInState, {});
  assert.equal(foursquareState.mayorState, "otherUser");
  assert.deepEqual(foursquareState.earnedBadges, []);
  assert.equal(foursquareState.socialActivities.length, 1);
  const activity = { id: "live-checkin", message: "June checked in." };
  foursquareState = foursquare.foursquareStateTransition(foursquareState, { type: "DELIVER_SOCIAL_ACTIVITY", activity });
  foursquareState = foursquare.foursquareStateTransition(foursquareState, { type: "DELIVER_SOCIAL_ACTIVITY", activity });
  assert.equal(foursquareState.socialActivities.length, 2);
  assert.equal(foursquareState.unreadActivityCount, 1);
  assert.equal(foursquareState.points, 0, "ambient activity must not mutate user gameplay state");
  assert.deepEqual(foursquareState.checkInState, {}, "ambient activity must not check in the session owner");
  assert.equal(foursquareState.mayorState, "otherUser");
  assert.deepEqual(foursquareState.earnedBadges, []);

  let tumblrState = tumblr.createInitialTumblrState();
  assert.ok(tumblrState.posts.every(post => post.origin === "seed"));
  assert.equal(tumblrState.posts.some(post => post.id === "late-note"), false);
  const livePost = { id: "late-note", type: "text", blog: "latewatch", title: "After midnight", content: "Quiet.", timestamp: "2010-10-20 12:12 AM" };
  tumblrState = tumblr.tumblrStateTransition(tumblrState, { type: "DELIVER_BACKGROUND_POST", post: livePost });
  tumblrState = tumblr.tumblrStateTransition(tumblrState, { type: "DELIVER_BACKGROUND_POST", post: livePost });
  assert.equal(tumblrState.posts.filter(post => post.id === livePost.id).length, 1);
  assert.equal(tumblrState.posts.at(-1).origin, "live");
  assert.equal(seed.tumblr.some(post => post.id === livePost.id), false, "Tumblr live item must not mutate the seed source");

  let flickrA = flickr.createInitialFlickrState();
  const flickrB = flickr.createInitialFlickrState();
  assert.notStrictEqual(flickrA.photos, flickrB.photos);
  assert.notStrictEqual(flickrA.photos[0], flickrB.photos[0]);
  assert.ok(flickrA.photos.every(photo => photo.origin === "seed" && photo.timestamp < "2010-10-20 12:02 AM"));
  flickrA = flickr.flickrStateTransition(flickrA, { type: "TOGGLE_FAVORITE", photoId: flickrA.photos[0].id });
  assert.equal(flickrA.favoritePhotoIds.length, 1);
  assert.equal(flickrB.favoritePhotoIds.length, 0, "Flickr Favorite state must remain session-local");

  const instagramState = instagram.createInitialInstagramState();
  assert.deepEqual({ photos: instagramState.photos.length, followers: instagramState.followers, following: instagramState.following }, { photos: 0, followers: 0, following: 0 });

  let tumblrZoey = tumblr.createInitialTumblrState();
  tumblrZoey = tumblr.tumblrStateTransition(tumblrZoey, { type: "TOGGLE_LIKE", postId: tumblrZoey.posts[0].id });
  tumblrZoey = tumblr.tumblrStateTransition(tumblrZoey, { type: "TOGGLE_REBLOG", postId: tumblrZoey.posts[0].id });
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
  const foursquareAlex = foursquare.foursquareStateTransition(
    foursquare.foursquareStateTransition(foursquare.createInitialFoursquareState(), { type: "CHECK_IN", venueId: "night-owl" }),
    { type: "RESET" },
  );
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
  assert.deepEqual(tumblrAlex.likedPostIds, []);
  assert.deepEqual(tumblrAlex.rebloggedPostIds, []);
  assert.deepEqual(foursquareAlex.checkInState, {});
  assert.equal(foursquareAlex.points, 0);

  const seedSource = await readFile(resolve(projectRoot, "src/data/sessionSeedContent.ts"), "utf8");
  assert.doesNotMatch(seedSource, /DeviceAudio|deviceEventScheduler|smsNotification/, "seed definitions must not depend on delivery systems");
  assert.ok(Object.isFrozen(seed) && Object.isFrozen(seed.messages) && Object.isFrozen(seed.twitter), "seed definitions must remain immutable");

  console.log("Historical seed-content state checks: PASS");
} finally {
  await vite.close();
}
