import assert from "node:assert/strict";
import { createHash } from "node:crypto";
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
  const coreSocialFriends = await vite.ssrLoadModule("/src/data/coreSocialFriends.ts");
  const facebookActors = await vite.ssrLoadModule("/src/data/facebookActors.ts");
  const facebookMedia = await vite.ssrLoadModule("/src/data/facebookMedia.ts");
  const sessionTimeline = await vite.ssrLoadModule("/src/data/sessionTimeline.ts");
  const scheduler = await vite.ssrLoadModule("/src/state/deviceEventScheduler.ts");
  const deviceMachine = await vite.ssrLoadModule("/src/state/deviceMachine.ts");

  const seed = seedContent.SESSION_SEED_CONTENT;
  assert.deepEqual(coreSocialFriends.CORE_SOCIAL_CHARACTER_IDS, ["katie", "matt", "alex", "chris", "jay", "june", "jack", "ben", "luca"]);
  assert.equal(coreSocialFriends.CORE_SOCIAL_CHARACTERS["author-z-tokyo"], undefined, "author easter egg must not enter the canonical character registry");
  assert.deepEqual(
    facebookActors.FACEBOOK_AUTHOR_EASTER_EGGS[facebookActors.FACEBOOK_AUTHOR_EASTER_EGG_ID],
    { id: "author-z-tokyo", displayName: "Z.tokyo", classification: "AUTHOR_EASTER_EGG", profileMediaId: "z-tokyo-profile-picture" },
  );
  assert.deepEqual(
    Object.values(coreSocialFriends.CORE_SOCIAL_CHARACTERS).map(character => [character.id, character.category, character.lifeStage, character.classification]),
    [
      ["katie", "core-friend", "young-social-circle", "CURATED FICTIONAL"],
      ["matt", "core-friend", "young-social-circle", "CURATED FICTIONAL"],
      ["alex", "core-friend", "young-social-circle", "CURATED FICTIONAL"],
      ["chris", "core-friend", "young-social-circle", "CURATED FICTIONAL"],
      ["jay", "core-friend", "young-social-circle", "CURATED FICTIONAL"],
      ["june", "narrative-contact", "young-social-circle", "CURATED FICTIONAL"],
      ["jack", "narrative-contact", "young-social-circle", "CURATED FICTIONAL"],
      ["ben", "extended-friend", "working-adult", "CURATED FICTIONAL"],
      ["luca", "extended-friend", "working-adult", "CURATED FICTIONAL"],
    ],
    "the canonical social character set, categories, and life-stage anchors must remain locked",
  );
  assert.strictEqual(coreSocialFriends.CORE_SOCIAL_FRIENDS.katie, coreSocialFriends.CORE_SOCIAL_CHARACTERS.katie, "compatibility views must reuse canonical identity objects");
  assert.strictEqual(coreSocialFriends.CORE_SOCIAL_FRIENDS.jay, coreSocialFriends.CORE_SOCIAL_CHARACTERS.jay, "compatibility views must not duplicate character records");
  assert.deepEqual(coreSocialFriends.CORE_SOCIAL_RELATIONSHIPS.map(relationship => relationship.characterIds), [["katie", "ben"], ["chris", "luca"]]);
  assert.equal(coreSocialFriends.CORE_SOCIAL_CHARACTERS.june.socialHandles.instagram, "junephoto", "June's Instagram username must remain canonical and session-independent");
  assert.deepEqual(coreSocialFriends.CORE_SOCIAL_FRIEND_IDS, ["katie", "matt", "alex", "chris", "jay"]);
  assert.deepEqual(
    Object.values(coreSocialFriends.CORE_SOCIAL_FRIENDS).map(friend => [friend.id, friend.displayName, friend.fictional]),
    [["katie", "Katie", true], ["matt", "Matt", true], ["alex", "Alex", true], ["chris", "Chris", true], ["jay", "Jay", true]],
    "core social friend identities must remain centralized and immutable",
  );
  const timelineDefinitions = sessionTimeline.SESSION_TIMELINE_EVENTS;
  const expectedTimeline = [
    ["initial-sms-mom-home-yet", 60, "initialSMS"],
    ["twitter-slang-epic-fail", 75, "twitterBackgroundTweet"],
    ["facebook-jack-request", 150, "facebookJackRequest"],
    ["facebook-june-message", 270, "facebookJuneMessage"],
    ["twitter-eva-school-tomorrow", 300, "twitterBackgroundTweet"],
    ["twitter-late-night-update", 390, "twitterBackgroundTweet"],
    ["foursquare-friend-checkin", 510, "foursquareActivity"],
    ["twitter-slang-fml", 540, "twitterBackgroundTweet"],
    ["tumblr-background-post", 630, "tumblrBackgroundPost"],
    ["twitter-nora-homework", 690, "twitterBackgroundTweet"],
    ["twitter-terminal-goodnight-world", 890, "twitterBackgroundTweet"],
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

  const lovePhrases = ["love u", "love you", "i love u", "i love you", "luv u", "luv you", "Yes, love you!"];
  lovePhrases.forEach(phrase => assert.equal(messages.isLoveYouIntent(phrase), true, `${phrase} must classify as explicit love intent`));
  ["love", "love home", "not love you", "I like you"].forEach(phrase => assert.equal(messages.isLoveYouIntent(phrase), false, `${phrase} must not classify as explicit love intent`));
  assert.equal(messages.classifyMomReply("yes love you"), "love", "love intent must take priority over the affirmative branch");

  let momLoveState = messages.createInitialMessagesState();
  momLoveState = messages.messagesStateTransition(momLoveState, { type: "OPEN_CONVERSATION", conversationId: "mom" });
  momLoveState = messages.messagesStateTransition(momLoveState, { type: "EDIT_DRAFT", value: "I love you" });
  momLoveState = messages.messagesStateTransition(momLoveState, { type: "SEND", elapsedMs: 120_000 });
  assert.equal(momLoveState.momLoveReply, "pending");
  assert.equal(momLoveState.momReply, "none", "love must not also schedule Good. Sleep early.");
  const momLoveDelay = messages.deterministicMomLoveReplyDelayMs("Zoey");
  assert.ok(momLoveDelay >= 20_000 && momLoveDelay <= 60_000, "Mom love delay must stay within the curated 20–60 second window");
  assert.equal(messages.deterministicMomLoveReplyDelayMs("Zoey"), momLoveDelay, "Mom love delay must be deterministic per session identity");
  let loveEvents = scheduler.scheduleDeviceEvent([], { id: "mom-love-reply", type: "momLoveReply", dueElapsedMs: 120_000 + momLoveDelay });
  loveEvents = scheduler.scheduleDeviceEvent(loveEvents, { id: "mom-love-reply", type: "momLoveReply", dueElapsedMs: 120_000 + momLoveDelay });
  assert.equal(loveEvents.length, 1, "Mom love event ID must be exactly-once");
  momLoveState = messages.messagesStateTransition(momLoveState, { type: "DELIVER_MOM_LOVE_REPLY" });
  momLoveState = messages.messagesStateTransition(momLoveState, { type: "DELIVER_MOM_LOVE_REPLY" });
  assert.equal(momLoveState.messages.filter(message => message.id === "mom-love-you-too").length, 1, "Mom love reply must deliver at most once");

  let affirmativeMomState = messages.createInitialMessagesState();
  affirmativeMomState = messages.messagesStateTransition(affirmativeMomState, { type: "OPEN_CONVERSATION", conversationId: "mom" });
  affirmativeMomState = messages.messagesStateTransition(affirmativeMomState, { type: "EDIT_DRAFT", value: "yes" });
  affirmativeMomState = messages.messagesStateTransition(affirmativeMomState, { type: "SEND", elapsedMs: 120_000 });
  assert.equal(affirmativeMomState.momReply, "pending", "existing affirmative Mom behavior must remain available");
  assert.equal(affirmativeMomState.momLoveReply, "none");

  let dadLoveState = messages.createInitialMessagesState();
  dadLoveState = messages.messagesStateTransition(dadLoveState, { type: "OPEN_CONVERSATION", conversationId: "dad" });
  dadLoveState = messages.messagesStateTransition(dadLoveState, { type: "EDIT_DRAFT", value: "luv u" });
  dadLoveState = messages.messagesStateTransition(dadLoveState, { type: "SEND", elapsedMs: 300_000 });
  assert.equal(dadLoveState.dadLoveReplyEligible, true);
  assert.equal(dadLoveState.dadLoveReply, "pending");
  const dadEvents = scheduler.scheduleDeviceEvent([], { id: "dad-love-terminal-reply", type: "dadLoveReply", dueElapsedMs: messages.DAD_LOVE_REPLY_DUE_ELAPSED_MS });
  assert.equal(dadEvents[0].dueElapsedMs, 890_000, "Dad love reply must remain fixed at T+890s");
  dadLoveState = messages.messagesStateTransition(dadLoveState, { type: "DELIVER_DAD_LOVE_REPLY" });
  dadLoveState = messages.messagesStateTransition(dadLoveState, { type: "DELIVER_DAD_LOVE_REPLY" });
  assert.equal(dadLoveState.messages.filter(message => message.id === "dad-sleep-early").length, 1, "Dad terminal reply must deliver at most once");

  let dadWithoutLoveState = messages.createInitialMessagesState();
  dadWithoutLoveState = messages.messagesStateTransition(dadWithoutLoveState, { type: "OPEN_CONVERSATION", conversationId: "dad" });
  dadWithoutLoveState = messages.messagesStateTransition(dadWithoutLoveState, { type: "EDIT_DRAFT", value: "Maybe later" });
  dadWithoutLoveState = messages.messagesStateTransition(dadWithoutLoveState, { type: "SEND", elapsedMs: 300_000 });
  assert.equal(dadWithoutLoveState.dadLoveReply, "none", "Dad must remain silent without explicit love intent");

  let lateDadLoveState = messages.createInitialMessagesState();
  lateDadLoveState = messages.messagesStateTransition(lateDadLoveState, { type: "OPEN_CONVERSATION", conversationId: "dad" });
  lateDadLoveState = messages.messagesStateTransition(lateDadLoveState, { type: "EDIT_DRAFT", value: "love you" });
  lateDadLoveState = messages.messagesStateTransition(lateDadLoveState, { type: "SEND", elapsedMs: 890_000 });
  assert.equal(lateDadLoveState.dadLoveReply, "none", "Dad love sent at or after the terminal-event cutoff must not schedule a reply");
  const resetLoveState = messages.messagesStateTransition(dadLoveState, { type: "RESET_RUNTIME" });
  assert.equal(resetLoveState.momLoveReply, "none");
  assert.equal(resetLoveState.dadLoveReplyEligible, false);
  assert.equal(resetLoveState.dadLoveReply, "none");

  messagesA = messages.messagesStateTransition(messagesA, { type: "RESET_RUNTIME" });
  unreadDadBadges = messagesBadge.messagesBadgeStateTransition(unreadDadBadges, { type: "RESET" });
  assert.deepEqual(messagesA.messages.map(message => [message.sender, message.status]), [["Dad", "unread"]], "Messages reset must restore the unread seed baseline");
  assert.deepEqual(unreadDadBadges, ["dad-dinner-tonight"]);
  assert.deepEqual(seed.messages.map(message => [message.sender, message.status]), [["Dad", "unread"]], "Messages runtime actions must not mutate the seed source");

  let facebookA = facebook.createInitialFacebookState("Zoey");
  const facebookB = facebook.createInitialFacebookState("Alex");
  assert.equal(facebookA.currentView, "home", "Facebook must launch into the audited Home hub");
  assert.deepEqual(facebookA.navigationStack, ["home"]);
  assert.equal(facebook.selectFacebookRequestCount(facebookA), 0);
  assert.equal(facebook.selectFacebookInboxUnreadCount(facebookA), 0);
  assert.equal(facebookA.friendRequestState, "none");
  assert.equal(facebook.selectFacebookJuneMessageState(facebookA), "none");
  assert.ok(facebookA.inboxThreads.every(thread => thread.origin === "seed" && thread.status === "read"));
  assert.deepEqual(facebookA.inboxThreads.map(thread => [thread.friendId, thread.sender]), [["katie", "Katie"], ["jay", "Jay"]]);
  assert.deepEqual(facebookA.feed.filter(item => item.friendId).map(item => [item.friendId, item.author]), [["alex", "Alex"], ["june", "June"], ["katie", "Katie"], ["jay", "Jay"], ["luca", "Luca"]]);
  const juneInstagramPost = facebookA.feed.find(item => item.id === "june-instagram-early-adopter");
  assert.deepEqual(
    [juneInstagramPost?.friendId, juneInstagramPost?.text, juneInstagramPost?.createdAt],
    ["june", "finally got instagram lol @junephoto", "2010-10-19T23:44:00-07:00"],
    "June's Facebook post must bridge to her canonical Instagram username before the session begins",
  );
  assert.doesNotMatch(juneInstagramPost?.text ?? "", /\bIG\b|follow my IG|link in bio|DM me/i, "June's early-adopter copy must avoid modern Instagram language");
  const zTokyoPost = facebookA.feed.find(item => item.id === "z-tokyo-profile-picture-update");
  assert.deepEqual(
    [zTokyoPost?.actor, zTokyoPost?.author, zTokyoPost?.text, zTokyoPost?.mediaId, zTokyoPost?.createdAt],
    [{ kind: "author-easter-egg", authorId: "author-z-tokyo" }, "Z.tokyo", "updated her profile picture.", "z-tokyo-profile-picture", "2010-10-18T20:52:00-07:00"],
  );
  const zTokyoMedia = facebookMedia.getFacebookMedia(zTokyoPost?.mediaId);
  assert.deepEqual(zTokyoMedia?.intendedUses, ["profile-picture", "wall-activity", "photos", "profile-pictures-album"]);
  assert.deepEqual(zTokyoMedia?.surfaceStatus, { profilePicture: "READY", wallActivity: "READY", photos: "HOLD", profilePicturesAlbum: "HOLD" });
  const zTokyoPortrait = await readFile(resolve(projectRoot, "src/assets/facebook/characters/z-tokyo/profile/IMG_1423.JPG"));
  assert.equal(createHash("sha256").update(zTokyoPortrait).digest("hex"), "46c233ae6b8425ba90008df67e64a3bbe8066457c4d12c524d7576efc5419021", "Z.tokyo portrait bytes must remain unchanged");
  let zTokyoProfile = facebook.facebookStateTransition(facebookA, { type: "OPEN_PROFILE", profileName: "Z.tokyo" });
  assert.deepEqual([zTokyoProfile.currentView, zTokyoProfile.selectedProfileName, zTokyoProfile.profileSection], ["profile", "Z.tokyo", "wall"]);
  assert.deepEqual(zTokyoProfile.feed.filter(item => item.author === "Z.tokyo").map(item => item.id), ["z-tokyo-profile-picture-update"], "Z.tokyo Wall must remain sparse and reuse the seed story");
  const alexPartyPost = facebookA.feed.find(item => item.id === "alex-jacks-party-friday");
  assert.ok(alexPartyPost, "Alex's Friday party post must exist as one canonical Facebook record");
  assert.deepEqual([alexPartyPost.friendId, alexPartyPost.visibility], ["alex", "friends-of-friends"]);
  assert.strictEqual(facebookA.feed.filter(item => item.author === "Alex").find(item => item.id === alexPartyPost.id), alexPartyPost, "News Feed and Alex Wall must reference the same post object");
  assert.deepEqual(
    facebookA.comments.filter(comment => comment.itemId === alexPartyPost.id).map(comment => [comment.author, comment.characterId, comment.ephemeralAuthor?.classification]),
    [["Jay", "jay", undefined], ["Ryan", undefined, "EPHEMERAL_FRIEND_OF_FRIEND"]],
  );
  assert.equal(coreSocialFriends.CORE_SOCIAL_CHARACTERS.ryan, undefined, "friend-of-friend commenter must not enter the canonical registry");
  const lucaBasketballPost = facebookA.feed.find(item => item.id === "luca-pickup-basketball-photos");
  assert.deepEqual(
    [lucaBasketballPost?.friendId, lucaBasketballPost?.photoCount, lucaBasketballPost?.relatedCharacterIds, lucaBasketballPost?.tagUiStatus],
    ["luca", 4, ["chris"], "HOLD"],
    "Luca's photo story must retain canonical Chris participation without fabricated tag UI",
  );
  facebookA = facebook.facebookStateTransition(facebookA, { type: "DELIVER_JACK_REQUEST" });
  facebookA = facebook.facebookStateTransition(facebookA, { type: "DELIVER_JUNE_MESSAGE" });
  facebookA = facebook.facebookStateTransition(facebookA, { type: "DELIVER_JACK_REQUEST" });
  facebookA = facebook.facebookStateTransition(facebookA, { type: "DELIVER_JUNE_MESSAGE" });
  assert.equal(facebookA.friendRequestState, "pending");
  assert.equal(facebook.selectFacebookJuneMessageState(facebookA), "unread");
  assert.equal(facebook.selectFacebookRequestCount(facebookA), 1, "Requests count must derive from pending state");
  assert.equal(facebook.selectFacebookInboxUnreadCount(facebookA), 1, "Inbox count must derive from unread threads");
  assert.equal(facebookA.inboxThreads.filter(thread => thread.id === "june-live-message").length, 1, "June live message must deliver once");
  assert.ok(facebookA.feed.every(item => item.origin === "seed"), "older Facebook feed content must remain seed content");
  assert.ok(facebookA.inboxThreads.filter(thread => thread.id !== "june-live-message").every(thread => thread.origin === "seed"), "older Facebook inbox content must survive live delivery");
  assert.equal(facebookB.friendRequestState, "none");
  assert.equal(facebookB.inboxThreads.some(thread => thread.id === "june-live-message"), false);

  const partyInviteDelay = facebook.deterministicFacebookPartyInviteDelayMs("Zoey");
  assert.ok(partyInviteDelay >= 20_000 && partyInviteDelay <= 60_000, "party invitation delay must stay within the curated 20-60 second window");
  assert.equal(facebook.deterministicFacebookPartyInviteDelayMs("Zoey"), partyInviteDelay, "party invitation delay must be deterministic per session identity");
  assert.equal(facebookA.partyInviteState, "none", "party invitation must not exist before either eligibility trigger");
  assert.equal(facebookA.inboxThreads.some(thread => thread.id === facebook.FACEBOOK_PARTY_INVITE_EVENT_ID), false);

  let junePartyState = facebook.facebookStateTransition(facebookA, { type: "OPEN_JUNE_MESSAGE" });
  junePartyState = facebook.facebookStateTransition(junePartyState, { type: "EDIT_JUNE_REPLY", value: "Still awake." });
  junePartyState = facebook.facebookStateTransition(junePartyState, { type: "SUBMIT_JUNE_REPLY", displayName: "Zoey" });
  assert.equal(junePartyState.partyInviteEligibleFromJune, true, "any non-empty June reply must establish June eligibility");
  assert.equal(junePartyState.partyInviteState, "eligible");

  let ignoredJackPartyState = facebook.facebookStateTransition(facebook.createInitialFacebookState("Zoey"), { type: "DELIVER_JACK_REQUEST" });
  ignoredJackPartyState = facebook.facebookStateTransition(ignoredJackPartyState, { type: "IGNORE_JACK" });
  assert.equal(ignoredJackPartyState.partyInviteEligibleFromJack, false, "ignoring Jack must not establish eligibility");
  assert.equal(ignoredJackPartyState.partyInviteState, "none");

  let jackPartyState = facebook.facebookStateTransition(facebook.createInitialFacebookState("Zoey"), { type: "DELIVER_JACK_REQUEST" });
  jackPartyState = facebook.facebookStateTransition(jackPartyState, { type: "ACCEPT_JACK" });
  assert.equal(jackPartyState.partyInviteEligibleFromJack, true, "accepting Jack must establish Jack eligibility");
  assert.equal(jackPartyState.partyInviteState, "eligible");

  const partyInviteDueElapsedMs = 300_000 + partyInviteDelay;
  let partyInviteEvents = scheduler.scheduleDeviceEvent([], {
    id: facebook.FACEBOOK_PARTY_INVITE_EVENT_ID,
    type: "facebookPartyInvite",
    dueElapsedMs: partyInviteDueElapsedMs,
    sourceApp: "facebook",
    deliveryPolicy: "internal",
    payload: { kind: "facebook-party-invite" },
    provenanceStatus: "CURATED",
  });
  partyInviteEvents = scheduler.scheduleDeviceEvent(partyInviteEvents, { ...partyInviteEvents[0] });
  assert.equal(partyInviteEvents.length, 1, "June and Jack paths must converge on one stable scheduled event ID");
  assert.equal(scheduler.nextDueDeviceEvent(partyInviteEvents, partyInviteDueElapsedMs - 1), null, "party invitation must not arrive before its deterministic delay");
  assert.equal(scheduler.nextDueDeviceEvent(partyInviteEvents, partyInviteDueElapsedMs)?.id, facebook.FACEBOOK_PARTY_INVITE_EVENT_ID);

  let sharedPartyState = facebook.facebookStateTransition(junePartyState, { type: "DELIVER_JACK_REQUEST" });
  sharedPartyState = facebook.facebookStateTransition(sharedPartyState, { type: "ACCEPT_JACK" });
  assert.deepEqual([sharedPartyState.partyInviteEligibleFromJune, sharedPartyState.partyInviteEligibleFromJack], [true, true]);
  sharedPartyState = facebook.facebookStateTransition(sharedPartyState, { type: "SHOW_HOME" });
  assert.equal(sharedPartyState.partyInviteState, "eligible", "Facebook navigation must preserve invite eligibility");
  sharedPartyState = facebook.facebookStateTransition(sharedPartyState, { type: "DELIVER_PARTY_INVITE", timestamp: "12:08 AM" });
  sharedPartyState = facebook.facebookStateTransition(sharedPartyState, { type: "DELIVER_PARTY_INVITE", timestamp: "12:09 AM" });
  assert.equal(sharedPartyState.partyInviteState, "delivered");
  assert.equal(sharedPartyState.inboxThreads.filter(thread => thread.id === facebook.FACEBOOK_PARTY_INVITE_EVENT_ID).length, 1, "party invitation must be delivered at most once");
  assert.equal(sharedPartyState.inboxThreads.find(thread => thread.id === facebook.FACEBOOK_PARTY_INVITE_EVENT_ID)?.status, "unread");
  sharedPartyState = facebook.facebookStateTransition(sharedPartyState, { type: "OPEN_MESSAGE", messageId: facebook.FACEBOOK_PARTY_INVITE_EVENT_ID });
  assert.equal(sharedPartyState.partyInviteState, "opened");
  assert.equal(sharedPartyState.inboxThreads.find(thread => thread.id === facebook.FACEBOOK_PARTY_INVITE_EVENT_ID)?.status, "read");
  const resetPartyState = facebook.facebookStateTransition(sharedPartyState, { type: "RESET", displayName: "Zoey" });
  assert.deepEqual(
    [resetPartyState.partyInviteState, resetPartyState.partyInviteEligibleFromJune, resetPartyState.partyInviteEligibleFromJack],
    ["none", false, false],
    "new session must clear party eligibility and delivery state",
  );
  assert.equal(resetPartyState.inboxThreads.some(thread => thread.id === facebook.FACEBOOK_PARTY_INVITE_EVENT_ID), false);

  let facebookNavigation = facebook.createInitialFacebookState("Zoey");
  facebookNavigation = facebook.facebookStateTransition(facebookNavigation, { type: "SHOW_FEED" });
  facebookNavigation = facebook.facebookStateTransition(facebookNavigation, { type: "SET_SCROLL_POSITION", scrollPosition: 73 });
  const feedAuthor = facebookNavigation.feed[0].author;
  facebookNavigation = facebook.facebookStateTransition(facebookNavigation, { type: "OPEN_PROFILE", profileName: feedAuthor });
  assert.equal(facebookNavigation.currentView, "profile");
  assert.equal(facebookNavigation.selectedProfileName, feedAuthor);
  assert.deepEqual(facebookNavigation.navigationStack, ["home", "feed", "profile"]);
  facebookNavigation = facebook.facebookStateTransition(facebookNavigation, { type: "GO_BACK" });
  assert.equal(facebookNavigation.currentView, "feed");
  assert.equal(facebookNavigation.scrollPosition, 73, "Profile Back must preserve Feed position");

  let facebookInbox = facebook.facebookStateTransition(facebookA, { type: "SHOW_INBOX" });
  assert.equal(facebook.selectFacebookInboxUnreadCount(facebookInbox), 1, "opening Inbox alone must not clear June unread");
  facebookInbox = facebook.facebookStateTransition(facebookInbox, { type: "OPEN_MESSAGE", messageId: "june-live-message" });
  assert.equal(facebook.selectFacebookInboxUnreadCount(facebookInbox), 0, "opening June must clear only its thread unread state");
  facebookInbox = facebook.facebookStateTransition(facebookInbox, { type: "GO_BACK" });
  assert.equal(facebookInbox.currentView, "inbox", "June Back must return to Inbox");

  let facebookAccept = facebook.facebookStateTransition(facebookA, { type: "ACCEPT_JACK" });
  assert.equal(facebookAccept.friendRequestState, "accepted");
  assert.deepEqual(facebookAccept.friends, [{ id: "jack", name: "Jack" }], "accepting Jack must add one session-local friend record");
  facebookAccept = facebook.facebookStateTransition(facebookAccept, { type: "SHOW_FRIENDS" });
  assert.equal(facebookAccept.currentView, "friends");
  assert.equal(facebookAccept.friends.some(friend => friend.id === "jack"), true, "accepted Jack must be available from Friends");
  assert.equal(facebook.selectFacebookRequestCount(facebookAccept), 0, "accepted request must leave no pending count");
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
  assert.equal(facebook.selectFacebookJuneMessageState(facebookPlayability), "read", "opening June must mark only the live June message read");
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "EDIT_JUNE_REPLY", value: "Still awake." });
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "SUBMIT_JUNE_REPLY", displayName: "Zoey" });
  assert.equal(facebook.selectFacebookJuneMessageState(facebookPlayability), "replied");
  assert.deepEqual(facebookPlayability.juneReplies, [{ id: "facebook-june-reply-1", author: "Zoey", text: "Still awake." }]);
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "OPEN_FEED_ITEM", itemId: "jack-movie", scrollPosition: 96 });
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "BEGIN_COMMENT", itemId: "jack-movie" });
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "EDIT_COMMENT", value: "I thought so too." });
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "SUBMIT_COMMENT", displayName: "Zoey" });
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "TOGGLE_LIKE", itemId: "jack-movie" });
  assert.deepEqual(facebookPlayability.comments.filter(comment => comment.origin === "user"), [{ id: "facebook-comment-1", itemId: "jack-movie", author: "Zoey", text: "I thought so too.", origin: "user" }]);
  assert.equal(facebookPlayability.comments.filter(comment => comment.origin === "seed").length, 2, "user comments must coexist with Alex's baseline discussion");
  assert.deepEqual(facebookPlayability.likedItemIds, ["jack-movie"]);
  assert.equal(facebook.selectFacebookJuneMessageState(facebookPlayability), "replied", "Feed interaction must not mutate June state");
  assert.deepEqual(facebookPlayability.friends, [], "Feed and message interaction must not mutate Friends state");
  assert.equal(facebookPlayability.scrollPosition, 96, "Facebook playability mutations must preserve feed scroll state");

  const twitterSeed = seed.twitter;
  assert.equal(twitterSeed.length, 14, "Twitter must start with the balanced fourteen-item seed timeline");
  const mattPartyTweet = twitterSeed.find(tweet => tweet.id === "matt-jacks-party");
  assert.deepEqual([mattPartyTweet?.friendId, mattPartyTweet?.displayName, mattPartyTweet?.text], ["matt", "Matt", "jack's party sounds exhausting lol"]);
  assert.equal(seed.facebook.feed.some(item => item.friendId === "matt" && item.text.includes("party")), false, "Matt's party reaction must remain Twitter-specific");
  assert.deepEqual(
    twitterSeed.map(tweet => tweet.timestamp),
    ["11:58 PM", "11:53 PM", "11:49 PM", "11:41 PM", "11:26 PM", "11:09 PM", "11:03 PM", "10:47 PM", "10:22 PM", "10:05 PM", "9:47 PM", "9:12 PM", "9:08 PM", "8:30 PM"],
    "Twitter seed must remain newest-first",
  );
  assert.equal(twitterSeed.filter(tweet => tweet.contentType === "manual-retweet").length, 2);
  assert.equal(twitterSeed.filter(tweet => tweet.contentType === "celebrity-discussion").length, 1);
  assert.equal(twitterSeed.filter(tweet => tweet.contentType === "ordinary").length, 4);
  assert.equal(twitterSeed.filter(tweet => tweet.contentType === "party-reaction").length, 1);
  assert.equal(twitterSeed.filter(tweet => tweet.contentType === "work-life").length, 5, "five work-life seed Tweets must rebalance the demographic tone");
  assert.equal(twitterSeed.filter(tweet => tweet.contentType === "apple-reference").length, 1, "Twitter must retain exactly one Apple reference");
  assert.equal(
    twitterSeed.filter(tweet => tweet.contentType === "apple-reference").length
      + timelineDefinitions.filter(event => event.sourceApp === "twitter" && /apple|back to the mac/i.test(event.payload?.post?.text ?? "")).length,
    1,
    "seed plus live Twitter must contain exactly one Apple reference",
  );
  assert.ok(twitterSeed.filter(tweet => tweet.contentType === "work-life").every(tweet => tweet.origin === "seed" && tweet.contentProvenance === "CURATED"));
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
  assert.equal(twitter.TWITTER_SUGGESTED_USER_COUNT, 20, "Suggested Users must expose the designed 20-account inventory");
  assert.equal(twitterState.suggestedUsers.length, 20);
  assert.ok(twitterState.suggestedUsers.every(user => (
    user.handle.startsWith("@")
    && user.avatarStatus === "DEV-HOLD"
    && ["PERIOD-EVIDENCE", "CURATED", "HOLD"].includes(user.provenance)
    && typeof user.evidence === "string"
    && user.evidence.length > 0
  )), "every Suggested User must carry identity and provenance metadata");
  assert.ok(twitterState.suggestedUsers.every(user => (
    ["followers", "following", "tweets", "favorites"].every(field => (
      ["EXACT", "NEAR-DATE", "ESTIMATED", "ESTIMATED-DISPLAY", "CURATED-FILL"].includes(user.statistics[field].provenance)
      && user.statistics[field].sourceNotes.length > 0
    ))
  )), "every real-account statistic field must retain provenance and source notes");
  assert.deepEqual(twitterState.suggestedUsers.find(user => user.id === "nasa").statistics.followers, {
    value: 616842,
    provenance: "ESTIMATED-DISPLAY",
    confidence: "high",
    sourceDate: "2010-10-25",
    sourceUrl: "https://clickz.com/nasa-hopes-gen-x-and-y-follow-its-social-media-lift-off/54178/",
    sourceNotes: "Deterministic display estimate within the evidence-supported range below ClickZ's 626,700 snapshot five days later; not an exact historical count.",
  });
  assert.equal(twitter.selectTwitterUserProfile(twitterState, "nasa", "Zoey").followerCount, 616842);
  assert.ok(twitterState.suggestedUsers.every(user => (
    [user.statistics.following, user.statistics.followers, user.statistics.tweets, user.statistics.favorites]
      .every(stat => Number.isInteger(stat.value) && stat.value >= 0)
  )), "every real Suggested User profile must have a complete four-count grid");
  const fictionalFollowerCounts = ["June", "Nora", "Mia", "Eli", "Eva"].map(name => twitter.getTwitterUserProfile(name, "Zoey").followerCount);
  assert.equal(new Set(fictionalFollowerCounts).size, fictionalFollowerCounts.length, "fictional profiles must not share a uniform CURATED count pattern");
  const baselineFollowingCount = twitterState.followedUserIds.length;
  const baselineFollowerCount = twitterState.ownerProfileStats.followerCount;
  assert.equal(twitter.selectTwitterFollowingUsers(twitterState, "Zoey").length, baselineFollowingCount);
  let followGraphState = twitter.twitterStateTransition(twitterState, { type: "SHOW_TAB", tab: "search" });
  assert.equal(followGraphState.currentView, "searchLanding");
  followGraphState = twitter.twitterStateTransition(followGraphState, { type: "OPEN_SUGGESTED_USERS" });
  assert.equal(followGraphState.currentView, "suggestedUsers");
  followGraphState = twitter.twitterStateTransition(followGraphState, { type: "SET_PEOPLE_SCROLL_POSITION", view: "suggestedUsers", scrollPosition: 137 });
  followGraphState = twitter.twitterStateTransition(followGraphState, { type: "OPEN_USER_PROFILE_BY_ID", profileId: "npr", originView: "suggestedUsers", scrollPosition: 142 });
  assert.equal(followGraphState.currentView, "userProfile");
  followGraphState = twitter.twitterStateTransition(followGraphState, { type: "BACK_FROM_PROFILE" });
  assert.equal(followGraphState.currentView, "suggestedUsers");
  assert.equal(followGraphState.suggestedUsersScrollPosition, 142, "Suggested Users Profile Back must restore the captured list position");
  followGraphState = twitter.twitterStateTransition(followGraphState, { type: "SET_FOLLOW", profileId: "npr", following: true });
  assert.equal(twitter.selectTwitterUserProfile(followGraphState, "session-owner", "Zoey").followingCount, baselineFollowingCount + 1);
  assert.equal(followGraphState.ownerProfileStats.followerCount, baselineFollowerCount, "Follow must not fabricate a follower-count change");
  assert.equal(twitter.selectTwitterUserProfile(followGraphState, "npr", "Zoey").following, true, "Suggested list and Profile must share one follow graph");
  const duplicateFollow = twitter.twitterStateTransition(followGraphState, { type: "SET_FOLLOW", profileId: "npr", following: true });
  assert.strictEqual(duplicateFollow, followGraphState, "repeated Follow must be idempotent");
  followGraphState = twitter.twitterStateTransition(followGraphState, { type: "OPEN_FOLLOWING" });
  assert.equal(followGraphState.currentView, "following");
  assert.ok(twitter.selectTwitterFollowingUsers(followGraphState, "Zoey").some(user => user.id === "npr"));
  followGraphState = twitter.twitterStateTransition(followGraphState, { type: "SET_PEOPLE_SCROLL_POSITION", view: "following", scrollPosition: 61 });
  followGraphState = twitter.twitterStateTransition(followGraphState, { type: "OPEN_USER_PROFILE_BY_ID", profileId: "npr", originView: "following", scrollPosition: 64 });
  followGraphState = twitter.twitterStateTransition(followGraphState, { type: "BACK_FROM_PROFILE" });
  assert.equal(followGraphState.currentView, "following");
  assert.equal(followGraphState.followingScrollPosition, 64, "Following Profile Back must restore the captured list position");
  followGraphState = twitter.twitterStateTransition(followGraphState, { type: "SET_FOLLOW", profileId: "npr", following: false });
  assert.equal(twitter.selectTwitterUserProfile(followGraphState, "session-owner", "Zoey").followingCount, baselineFollowingCount);
  assert.equal(followGraphState.followedUserIds.includes("npr"), false);
  const duplicateUnfollow = twitter.twitterStateTransition(followGraphState, { type: "SET_FOLLOW", profileId: "npr", following: false });
  assert.strictEqual(duplicateUnfollow, followGraphState, "repeated Unfollow must be idempotent");
  let universalFollowState = twitter.twitterStateTransition(followGraphState, { type: "SET_FOLLOW", profileId: "june", following: true });
  assert.equal(twitter.selectTwitterUserProfile(universalFollowState, "june", "Zoey").following, true, "Timeline-only profiles must use the shared graph");
  assert.equal(twitter.selectTwitterUserProfile(universalFollowState, "june", "Zoey").followerCount, 221, "an initially-unfollowed target gains one displayed follower");
  assert.ok(twitter.selectTwitterFollowingUsers(universalFollowState, "Zoey").some(user => user.id === "june"), "universal follows must appear in Following");
  assert.equal(twitter.selectTwitterUserProfile(universalFollowState, "session-owner", "Zoey").followingCount, baselineFollowingCount + 1);
  const universalFollowingProfile = twitter.twitterStateTransition(
    twitter.twitterStateTransition(universalFollowState, { type: "OPEN_FOLLOWING" }),
    { type: "OPEN_USER_PROFILE_BY_ID", profileId: "june", originView: "following", scrollPosition: 88 },
  );
  assert.equal(universalFollowingProfile.selectedUserId, "june", "Following must open profiles that are outside Suggested Users");
  assert.equal(universalFollowingProfile.followingScrollPosition, 88);
  const repeatedUniversalFollow = twitter.twitterStateTransition(universalFollowState, { type: "SET_FOLLOW", profileId: "june", following: true });
  assert.strictEqual(repeatedUniversalFollow, universalFollowState, "universal Follow must remain idempotent");
  assert.equal(twitter.selectTwitterUserProfile(repeatedUniversalFollow, "june", "Zoey").followerCount, 221, "repeated Follow must not stack follower deltas");
  universalFollowState = twitter.twitterStateTransition(universalFollowState, { type: "SET_FOLLOW", profileId: "june", following: false });
  assert.equal(twitter.selectTwitterUserProfile(universalFollowState, "june", "Zoey").following, false);
  assert.equal(twitter.selectTwitterUserProfile(universalFollowState, "june", "Zoey").followerCount, 220, "Unfollow must restore an initially-unfollowed target baseline");
  assert.equal(twitter.selectTwitterFollowingUsers(universalFollowState, "Zoey").some(user => user.id === "june"), false);
  const repeatedUniversalUnfollow = twitter.twitterStateTransition(universalFollowState, { type: "SET_FOLLOW", profileId: "june", following: false });
  assert.strictEqual(repeatedUniversalUnfollow, universalFollowState, "universal Unfollow must remain idempotent");
  assert.equal(twitter.selectTwitterUserProfile(repeatedUniversalUnfollow, "june", "Zoey").followerCount, 220);
  const nasaUnfollowed = twitter.twitterStateTransition(universalFollowState, { type: "SET_FOLLOW", profileId: "nasa", following: false });
  assert.equal(twitter.selectTwitterUserProfile(universalFollowState, "nasa", "Zoey").followerCount, 616842, "baseline-followed target must not receive an initial extra follower");
  assert.equal(twitter.selectTwitterUserProfile(nasaUnfollowed, "nasa", "Zoey").followerCount, 616841, "baseline-followed target loses one displayed follower when unfollowed");
  const nasaRefollowed = twitter.twitterStateTransition(nasaUnfollowed, { type: "SET_FOLLOW", profileId: "nasa", following: true });
  assert.equal(twitter.selectTwitterUserProfile(nasaRefollowed, "nasa", "Zoey").followerCount, 616842, "refollow restores the historical baseline without double counting");
  const selfFollowAttempt = twitter.twitterStateTransition(universalFollowState, { type: "SET_FOLLOW", profileId: "session-owner", following: true });
  assert.strictEqual(selfFollowAttempt, universalFollowState, "reducer must reject self-follow even if UI dispatches it");
  const followReset = twitter.twitterStateTransition(
    twitter.twitterStateTransition(universalFollowState, { type: "SET_FOLLOW", profileId: "june", following: true }),
    { type: "RESET", displayName: "Alex" },
  );
  assert.equal(twitter.selectTwitterUserProfile(followReset, "session-owner", "Alex").followingCount, baselineFollowingCount, "new session must restore the designed follow baseline");
  assert.equal(followReset.followedUserIds.includes("npr"), false, "Zoey Follow state must not leak to Alex");
  assert.equal(followReset.followedUserIds.includes("june"), false, "universal Follow state must reset with the session");
  assert.equal(twitter.selectTwitterUserProfile(followReset, "june", "Alex").followerCount, 220, "session reset must remove target follower deltas");
  assert.equal(twitter.selectTwitterUserProfile(followReset, "nasa", "Alex").followerCount, 616842, "session reset must restore baseline-followed target count");
  assert.equal(twitter.selectTwitterLiveFollowerDelta("nasa", 0, "Zoey"), 0, "live drift must begin at zero at T0");
  const nasaDriftAt300 = twitter.selectTwitterLiveFollowerDelta("nasa", 300, "Zoey");
  assert.notEqual(nasaDriftAt300, 0, "eligible public-account follower count should drift over simulated time");
  assert.equal(twitter.selectTwitterLiveFollowerDelta("nasa", 300, "Zoey"), nasaDriftAt300, "same session/account/second must reproduce the same drift");
  assert.equal(twitter.selectTwitterLiveFollowerDelta("june", 300, "Zoey"), 0, "fictional ordinary users must not receive live drift");
  const nasaAt300 = twitter.selectTwitterUserProfile(twitterState, "nasa", "Zoey", 300).followerCount;
  const nasaUnfollowAt300 = twitter.selectTwitterUserProfile(
    twitter.twitterStateTransition(twitterState, { type: "SET_FOLLOW", profileId: "nasa", following: false }),
    "nasa", "Zoey", 300,
  ).followerCount;
  assert.equal(nasaAt300 - nasaUnfollowAt300, 1, "Follow graph ±1 must remain independent from live follower drift");
  assert.ok(Math.abs(twitter.selectTwitterLiveFollowerDelta("barackobama", 900, "Zoey")) <= 500, "session drift must respect its curated cap");
  assert.equal(followReset.suggestedUsersScrollPosition, 0);
  assert.equal(followReset.followingScrollPosition, 0);
  assert.equal(twitterState.mentions.length, 2);
  assert.deepEqual(twitterState.mentions.map(item => item.unread), [true, false]);
  assert.equal(twitterState.directMessages.length, 2);
  assert.deepEqual(twitterState.directMessages.map(item => item.unread), [true, false]);
  assert.deepEqual(twitterState.mentions.map(item => item.friendId), ["alex", "chris"]);
  assert.deepEqual(twitterState.directMessages.map(item => item.friendId), ["katie", "matt"]);
  assert.equal(twitterState.directMessages[0].friendId, facebookA.inboxThreads.find(thread => thread.sender === "Katie")?.friendId, "Katie must reuse one cross-app friend ID");
  assert.equal(twitter.selectTwitterMentionsUnreadCount(twitterState), 1);
  assert.equal(twitter.selectTwitterDirectMessagesUnreadCount(twitterState), 1);
  const timelineNames = new Set(twitterState.timeline.map(tweet => tweet.displayName.toLowerCase()));
  const mentionNames = twitterState.mentionTweets.map(tweet => tweet.displayName);
  assert.ok([...mentionNames, twitterState.directMessages.find(item => item.friendId === "katie")?.sender].filter(Boolean).every(name => !timelineNames.has(name.toLowerCase())), "Alex, Chris, and Katie social records must remain outside the seed Timeline");
  assert.ok(timelineNames.has("matt"), "Matt's canonical identity may span DM and Timeline for the party fragment");
  assert.equal(new Set([...mentionNames, ...twitterState.directMessages.map(item => item.sender)]).size, 4);
  assert.ok(twitterState.followedUserIds.includes("alex"), "Alex must be followed in the designed baseline graph");
  assert.equal(twitterState.followedUserIds.includes("chris"), false, "Chris must remain initially unfollowed");
  const homeActivities = twitter.selectTwitterTimelineActivities(twitterState);
  const alexMentionTweet = twitterState.mentionTweets.find(tweet => tweet.displayName === "Alex");
  const chrisMentionTweet = twitterState.mentionTweets.find(tweet => tweet.displayName === "Chris");
  assert.ok(alexMentionTweet && homeActivities.some(activity => activity.tweet === alexMentionTweet), "Home Timeline must reference the same Alex Tweet object used by Mentions");
  assert.ok(chrisMentionTweet && !homeActivities.some(activity => activity.tweet.id === chrisMentionTweet.id), "Chris @reply must remain absent from Home Timeline");
  assert.deepEqual(twitterState.linkedTweets.map(tweet => [tweet.displayName, tweet.text, tweet.contentStatus]), [["Conan O'Brien", "Saw Jackass 3D. Not as good as the book.", "PERIOD-EVIDENCE"]]);
  let mentionState = twitter.twitterStateTransition(twitterState, { type: "SHOW_TAB", tab: "mentions" });
  assert.equal(twitter.selectTwitterMentionsUnreadCount(mentionState), 1, "opening Mentions tab alone must not clear unread state");
  mentionState = twitter.twitterStateTransition(mentionState, { type: "OPEN_MENTION", mentionId: "mention-alex-conan", scrollPosition: 73 });
  assert.equal(mentionState.mentions.find(item => item.id === "mention-alex-conan").unread, false);
  assert.equal(twitter.selectTwitterMentionsUnreadCount(mentionState), 0, "reading the final unread Mention must clear its derived indicator count");
  assert.deepEqual([mentionState.currentView, mentionState.selectedTweetId, mentionState.mentionsScrollPosition], ["tweetDetail", "tweet-mention-alex-conan", 73]);
  assert.ok(twitter.selectTwitterTimelineActivities(mentionState).some(activity => activity.tweet.id === "tweet-mention-alex-conan"), "reading Mention state must not remove Alex from Timeline");
  mentionState = twitter.twitterStateTransition(mentionState, { type: "TOGGLE_FAVORITE", tweetId: "tweet-mention-alex-conan" });
  assert.ok(mentionState.favoriteTweetIds.includes("tweet-mention-alex-conan"), "Favorite must be shared by Mentions and Timeline through the Tweet ID");
  mentionState = twitter.twitterStateTransition(mentionState, { type: "TOGGLE_RETWEET", tweetId: "tweet-mention-alex-conan", retweetedBy: "Zoey", retweetActionTimestamp: 100 });
  assert.ok(mentionState.retweetedTweetIds.includes("tweet-mention-alex-conan"), "Retweet must be shared by Mentions and Timeline through the Tweet ID");
  mentionState = twitter.twitterStateTransition(mentionState, { type: "BACK_TO_TIMELINE" });
  assert.deepEqual([mentionState.activeTab, mentionState.currentView, mentionState.mentionsScrollPosition], ["mentions", "mentions", 73], "linked Tweet Back must restore Mentions origin and scroll");
  let dmState = twitter.twitterStateTransition(twitterState, { type: "SHOW_TAB", tab: "messages" });
  assert.equal(twitter.selectTwitterDirectMessagesUnreadCount(dmState), 1, "opening Messages tab alone must not clear unread state");
  dmState = twitter.twitterStateTransition(dmState, { type: "OPEN_DIRECT_MESSAGE", threadId: "dm-katie", scrollPosition: 41 });
  assert.equal(dmState.directMessages.find(thread => thread.id === "dm-katie").unread, false);
  assert.equal(twitter.selectTwitterDirectMessagesUnreadCount(dmState), 0, "reading the final unread DM must clear its derived indicator count");
  dmState = twitter.twitterStateTransition(dmState, { type: "OPEN_LINKED_TWEET", tweetId: "historical-conan-jackass-3d", origin: "dmThread" });
  dmState = twitter.twitterStateTransition(dmState, { type: "BACK_TO_TIMELINE" });
  assert.deepEqual([dmState.activeTab, dmState.currentView, dmState.selectedDirectMessageId], ["messages", "dmThread", "dm-katie"]);
  dmState = twitter.twitterStateTransition(dmState, { type: "BACK_TO_MESSAGES" });
  assert.deepEqual([dmState.currentView, dmState.messagesScrollPosition], ["messagesList", 41]);
  const socialReset = twitter.twitterStateTransition(dmState, { type: "RESET", displayName: "Alex" });
  assert.deepEqual(socialReset.mentions.map(item => item.unread), [true, false]);
  assert.deepEqual(socialReset.directMessages.map(item => item.unread), [true, false]);
  assert.deepEqual([twitter.selectTwitterMentionsUnreadCount(socialReset), twitter.selectTwitterDirectMessagesUnreadCount(socialReset)], [1, 1], "new session must restore both unread indicators from seed records");
  const multipleUnreadMentions = { ...twitterState, mentions: twitterState.mentions.map(item => ({ ...item, unread: true })) };
  const oneMentionRead = twitter.twitterStateTransition(multipleUnreadMentions, { type: "OPEN_MENTION", mentionId: "mention-chris-thing", scrollPosition: 0 });
  assert.equal(twitter.selectTwitterMentionsUnreadCount(oneMentionRead), 1, "reading one item must leave the indicator while another Mention remains unread");
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
  assert.equal(twitterState.newTweetDraft, "", "Timeline Compose must open a blank New Tweet draft");
  twitterState = twitter.twitterStateTransition(twitterState, { type: "EDIT_COMPOSER", value: "draft from top compose" });
  assert.equal(twitterState.newTweetDraft, "draft from top compose");
  assert.equal(twitterState.replyDraft, "", "new Tweet and Reply drafts must remain independent");
  twitterState = twitter.twitterStateTransition(twitterState, { type: "CANCEL_REPLY" });
  assert.equal(twitterState.currentView, "timeline");
  assert.equal(twitterState.composerKind, null);
  assert.equal(twitterState.newTweetDraft, "");

  let userTweetState = twitter.twitterStateTransition(twitter.createInitialTwitterState("Zoey"), { type: "BEGIN_NEW_TWEET" });
  userTweetState = twitter.twitterStateTransition(userTweetState, { type: "EDIT_COMPOSER", value: "x".repeat(141) });
  assert.equal(userTweetState.newTweetDraft.length, 140, "New Tweets must enforce the 140-character limit in state");
  userTweetState = twitter.twitterStateTransition(userTweetState, { type: "EDIT_COMPOSER", value: "still up" });
  userTweetState = twitter.twitterStateTransition(userTweetState, {
    type: "SUBMIT_NEW_TWEET",
    displayName: "Zoey",
    createdAt: Date.parse("2010-10-20T00:07:15-07:00"),
    timestamp: "12:07 AM",
  });
  const userTweet = userTweetState.timeline.find(tweet => tweet.id === "twitter-user-tweet-1");
  assert.deepEqual(userTweet, {
    id: "twitter-user-tweet-1",
    displayName: "Zoey",
    authorHandle: "@zoey",
    text: "still up",
    timestamp: "12:07 AM",
    createdAt: Date.parse("2010-10-20T00:07:15-07:00"),
    type: "tweet",
    contentStatus: "USER",
    origin: "user",
  });
  assert.equal(userTweetState.timeline[0].id, "twitter-user-tweet-1", "successful Compose must return the user Tweet at the current top");
  const afterDuplicateSubmit = twitter.twitterStateTransition(userTweetState, {
    type: "SUBMIT_NEW_TWEET",
    displayName: "Zoey",
    createdAt: Date.parse("2010-10-20T00:07:16-07:00"),
    timestamp: "12:07 AM",
  });
  assert.strictEqual(afterDuplicateSubmit, userTweetState, "a completed composer must not publish twice");
  userTweetState = twitter.twitterStateTransition(userTweetState, {
    type: "DELIVER_TIMELINE_TWEET",
    tweet: { id: "later-live", displayName: "Mia", text: "later", timestamp: "12:08 AM" },
  });
  assert.equal(userTweetState.timeline[0].id, "later-live", "a later live Tweet must sort above an earlier user Tweet");
  assert.equal(userTweetState.scrollPosition, 0);
  userTweetState = twitter.twitterStateTransition(userTweetState, {
    type: "TOGGLE_RETWEET",
    tweetId: "still-awake",
    retweetedBy: "Zoey",
    retweetActionTimestamp: Date.parse("2010-10-20T00:09:00-07:00"),
  });
  assert.deepEqual(
    twitter.selectTwitterTimelineActivities(userTweetState).slice(0, 3).map(activity => activity.id),
    ["user-retweet:still-awake", "later-live", "twitter-user-tweet-1"],
    "seed/live/user/native-Retweet activity must share one effective-time ordering",
  );
  const selfRetweetState = twitter.twitterStateTransition(userTweetState, {
    type: "TOGGLE_RETWEET",
    tweetId: "twitter-user-tweet-1",
    retweetedBy: "Zoey",
    retweetActionTimestamp: Date.parse("2010-10-20T00:10:00-07:00"),
  });
  assert.strictEqual(selfRetweetState, userTweetState, "self-Retweet remains disabled/HOLD");
  const userTweetReset = twitter.twitterStateTransition(userTweetState, { type: "RESET", displayName: "Alex" });
  assert.equal(userTweetReset.timeline.some(tweet => tweet.origin === "user"), false, "new session must remove user-authored Tweets");
  assert.equal(userTweetReset.timeline.find(tweet => tweet.id === "late-night-user")?.displayName, "Alex");
  const scheduledTwitterPosts = timelineDefinitions
    .filter(event => event.payload?.kind === "twitter-post")
    .map(event => event.payload.post);
  assert.equal(scheduledTwitterPosts.length, 6, "Twitter must be the most active social app with six live additions");
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
  const epicFailEvent = timelineDefinitions.find(event => event.id === "twitter-slang-epic-fail");
  const fmlEvent = timelineDefinitions.find(event => event.id === "twitter-slang-fml");
  const terminalTweetEvent = timelineDefinitions.find(event => event.id === "twitter-terminal-goodnight-world");
  assert.deepEqual(
    [epicFailEvent?.atElapsedSeconds, epicFailEvent?.payload?.kind === "twitter-post" ? epicFailEvent.payload.post.timestamp : null, epicFailEvent?.languageReference],
    [75, "12:03 AM", "PERIOD-EVIDENCE"],
  );
  assert.deepEqual(
    [fmlEvent?.atElapsedSeconds, fmlEvent?.payload?.kind === "twitter-post" ? fmlEvent.payload.post.timestamp : null, fmlEvent?.languageReference],
    [540, "12:11 AM", "PERIOD-EVIDENCE"],
  );
  assert.deepEqual(
    [terminalTweetEvent?.atElapsedSeconds, terminalTweetEvent?.payload?.kind === "twitter-post" ? terminalTweetEvent.payload.post.text : null, terminalTweetEvent?.payload?.kind === "twitter-post" ? terminalTweetEvent.payload.post.timestamp : null, terminalTweetEvent?.role],
    [890, "goodnight, world.", "12:17 AM", "terminal-easter-egg"],
  );
  assert.ok(terminalTweetEvent.atElapsedSeconds * 1_000 < deviceMachine.SESSION_DURATION_MS, "terminal Tweet must be due before the T+900s battery boundary");
  assert.equal(deviceMachine.SESSION_DURATION_MS, 900_000, "battery terminal must remain T+900s");
  assert.ok(timelineDefinitions.filter(event => event.atElapsedSeconds <= 720).some(event => event.id === "twitter-slang-epic-fail"));
  assert.ok(timelineDefinitions.filter(event => event.atElapsedSeconds <= 720).some(event => event.id === "twitter-slang-fml"), "both slang events must be catch-up eligible by 12:14 AM");
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
  assert.equal(twitterState.currentView, "messagesList");
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
  assert.equal(twitterState.timeline[0].id, "terminal-goodnight-world", "terminal live activity must sort above earlier live and seed items");
  assert.deepEqual(
    twitterState.timeline.slice(0, 6).map(tweet => tweet.id),
    ["terminal-goodnight-world", "nora-homework", "slang-fml", "late-night-line", "eva-school-tomorrow", "slang-epic-fail"],
    "live Twitter activity must remain newest-first",
  );
  assert.ok(
    ["terminal-goodnight-world", "slang-fml", "slang-epic-fail"].every(id => twitterState.timeline.find(tweet => tweet.id === id)?.origin === "live"),
    "v0.7 Twitter additions must enter runtime state as live content",
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
  assert.equal(twitterReset.newTweetDraft, "");
  assert.equal(twitterReset.nextUserTweetSequence, 1);
  assert.equal(twitterReset.activeTab, "timeline");
  assert.equal(twitterReset.currentView, "timeline");
  assert.equal(twitterReset.composerKind, null);
  assert.equal(twitterReset.revealedTweetId, null);
  assert.equal(twitterReset.timeline.length, 14);
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
  assert.equal(instagramState.knownAccounts.length, 1, "Instagram must remain sparse with exactly one familiar early adopter");
  const juneInstagramAccount = instagram.selectInstagramKnownAccountByUsername(instagramState, "@junephoto");
  assert.deepEqual(
    [juneInstagramAccount?.canonicalCharacterId, juneInstagramAccount?.username, juneInstagramAccount?.displayName, juneInstagramAccount?.photoCount],
    ["june", "junephoto", "June", 0],
  );
  assert.equal(juneInstagramAccount?.username, coreSocialFriends.CORE_SOCIAL_CHARACTERS.june.socialHandles.instagram, "Facebook and Instagram must resolve the same canonical June handle");
  assert.deepEqual([juneInstagramAccount?.discoveryUiStatus, juneInstagramAccount?.followUiStatus], ["HOLD", "HOLD"]);
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
  assert.equal(facebook.selectFacebookJuneMessageState(facebookAlex), "none");
  assert.deepEqual(facebookAlex.juneReplies, []);
  assert.equal(facebookAlex.juneReplyDraft, "");
  assert.deepEqual(facebookAlex.comments.map(comment => comment.id), ["alex-party-comment-jay", "alex-party-comment-ryan"]);
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
  assert.deepEqual(instagramAlex.knownAccounts.map(account => [account.canonicalCharacterId, account.username]), [["june", "junephoto"]], "new session must restore the sparse canonical June mapping");

  const seedSource = await readFile(resolve(projectRoot, "src/data/sessionSeedContent.ts"), "utf8");
  const facebookContainerSource = await readFile(resolve(projectRoot, "src/device/FacebookContainer.tsx"), "utf8");
  const twitterContainerSource = await readFile(resolve(projectRoot, "src/device/TwitterContainer.tsx"), "utf8");
  const deviceCssSource = await readFile(resolve(projectRoot, "src/styles/device.css"), "utf8");
  const timelineCellSource = twitterContainerSource.match(/function TimelineTweet[\s\S]*?function TweetDetail/)?.[0] ?? "";
  assert.doesNotMatch(seedSource, /DeviceAudio|deviceEventScheduler|smsNotification/, "seed definitions must not depend on delivery systems");
  assert.match(facebookContainerSource, /getFacebookMedia\(item\.mediaId\)/, "Facebook Feed must resolve portrait media through the centralized registry");
  assert.match(facebookContainerSource, /getFacebookMedia\(authorIdentity\.profileMediaId\)/, "Facebook Profile must resolve portrait media through the centralized registry");
  assert.ok(["Timeline", "Mentions", "Messages", "Search", "More"].every(label => twitterContainerSource.includes(`"${label}"`)), "Twitter must expose the five period tab destinations");
  assert.match(twitterContainerSource, /twitter-tweet-action-row/, "Twitter must render the swipe-revealed action row");
  assert.match(twitterContainerSource, /twitter-avatar-fixture/, "Twitter cells must not leave the avatar column visually empty");
  assert.doesNotMatch(timelineCellSource, /twitter-tweet-handle/, "Timeline cells must not render a redundant second @handle line");
  assert.match(twitterContainerSource, /Suggested Users/, "Search must expose the period Suggested Users destination");
  assert.match(twitterContainerSource, /UNFOLLOW/, "Suggested Users and Profile must expose period-style Follow terminology");
  assert.match(twitterContainerSource, /toLocaleString\("en-US"/, "Twitter profile counts must use full en-US integer grouping");
  assert.match(deviceCssSource, /\.twitter-profile-stats \{[^}]*grid-template-columns: repeat\(2,/, "Twitter Profile stats must use a 2-column grid");
  assert.match(deviceCssSource, /\.twitter-container \{[^}]*display: grid;[^}]*grid-template-rows: 44px minmax\(0,1fr\) 49px;/, "Twitter shell must reserve a stable header/content/footer grid");
  assert.match(deviceCssSource, /\.twitter-container > nav \{ grid-row: 3; \}/, "Twitter tab bar must remain in the fixed third shell row");
  assert.match(deviceCssSource, /\.twitter-social-list \{ position: relative; inset: auto; overflow-y: auto;/, "Mentions and Messages must scroll inside the bounded content row");
  assert.match(twitterContainerSource, /selectTwitterMentionsUnreadCount\(state\)/, "Mentions tab indicator must derive from unread records");
  assert.match(twitterContainerSource, /selectTwitterDirectMessagesUnreadCount\(state\)/, "Messages tab indicator must derive from unread records");
  assert.match(deviceCssSource, /\.twitter-tab-unread-indicator \{[^}]*background: #2d83b4;/, "Twitter unread treatment must remain a small blue period-style indicator");
  const profileStatsSource = twitterContainerSource.match(/<section className="twitter-profile-stats"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(
    profileStatsSource.indexOf("following") < profileStatsSource.indexOf("tweets")
      && profileStatsSource.indexOf("tweets") < profileStatsSource.indexOf("followers")
      && profileStatsSource.indexOf("followers") < profileStatsSource.indexOf("favorites"),
    "Twitter Profile stats order must be following/tweets then followers/favorites",
  );
  assert.doesNotMatch(twitterContainerSource, /twitter-composer-identity/, "New Tweet must not use the rejected large avatar/name composer row");
  assert.match(twitterContainerSource, /twitter-composer-account/, "New Tweet must expose compact current-account context");
  assert.match(twitterContainerSource, /attachments \(\.\.\.\)/, "New Tweet must expose the period attachment disclosure structure");
  assert.doesNotMatch(twitterContainerSource, /Quote Tweet|Explore|Spaces|Notifications/, "Twitter IA must not introduce later navigation/features");
  assert.ok(Object.isFrozen(seed) && Object.isFrozen(seed.messages) && Object.isFrozen(seed.twitter), "seed definitions must remain immutable");

  console.log("Historical seed-content state checks: PASS");
} finally {
  await vite.close();
}
