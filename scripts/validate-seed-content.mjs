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
  const instagramPopular = await vite.ssrLoadModule("/src/data/instagramPopularContent.ts");
  const seedContent = await vite.ssrLoadModule("/src/data/sessionSeedContent.ts");
  const coreSocialFriends = await vite.ssrLoadModule("/src/data/coreSocialFriends.ts");
  const facebookActors = await vite.ssrLoadModule("/src/data/facebookActors.ts");
  const facebookMedia = await vite.ssrLoadModule("/src/data/facebookMedia.ts");
  const facebookAlbums = await vite.ssrLoadModule("/src/data/facebookAlbums.ts");
  const facebookStoryMedia = await vite.ssrLoadModule("/src/data/facebookStoryMedia.ts");
  const facebookStoryTime = await vite.ssrLoadModule("/src/data/facebookStoryTime.ts");
  const facebookActorMedia = await vite.ssrLoadModule("/src/data/facebookActorMedia.ts");
  const sharedCharacterMedia = await vite.ssrLoadModule("/src/data/sharedCharacterMedia.ts");
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
  const facebookSessionStartMs = Date.parse("2010-10-20T00:02:00-07:00");
  const formatFacebookTime = (storyTimestamp, elapsedSeconds, extras = {}) => facebookStoryTime.formatFacebookStoryTime({ storyTimestamp, simulatedNowMs: facebookSessionStartMs + elapsedSeconds * 1_000, storyType: "status", ...extras });
  assert.equal(formatFacebookTime("2010-10-20T00:03:00-07:00", 60), "just now");
  assert.equal(formatFacebookTime("2010-10-20T00:03:00-07:00", 120), "1 minute ago");
  assert.equal(formatFacebookTime("2010-10-20T00:03:00-07:00", 180), "2 minutes ago");
  assert.equal(formatFacebookTime("2010-10-19T20:02:00-07:00", 0), "Tue 8:02 PM");
  assert.equal(formatFacebookTime("2010-10-18T20:51:00-07:00", 0), "Mon 8:51 PM");
  assert.equal(formatFacebookTime("2010-05-15T18:00:00-07:00", 0), "May 15");
  assert.equal(formatFacebookTime("2010-10-18T20:51:00-07:00", 0, { sourceApp: "iPhoto Uploader" }), "Mon 8:51 PM via iPhoto Uploader");
  assert.equal(formatFacebookTime("2010-10-19T22:44:00-07:00", 0, { storyType: "checkin" }), "Tue 10:44 PM", "previous-day Places stories must expose the cross-midnight calendar boundary");
  const futureStoryDisplay = formatFacebookTime("2010-10-20T00:10:00-07:00", 0, { storyId: "invalid-future-seed" });
  assert.equal(futureStoryDisplay, "Wed 12:10 AM", "future timestamps must use deterministic absolute fallback rather than just now");
  assert.notEqual(futureStoryDisplay, "just now");
  const facebookSeedTimestampAudit = Object.fromEntries(seed.facebook.feed.filter(item => item.origin === "seed").map(item => [item.id, item.createdAt]));
  assert.deepEqual(
    Object.fromEntries(["ben-long-day", "jack-movie", "alex-jacks-party-friday", "katie-coffee"].map(id => [id, facebookSeedTimestampAudit[id]])),
    {
      "ben-long-day": "2010-10-19T23:58:00-07:00",
      "jack-movie": "2010-10-19T23:52:00-07:00",
      "alex-jacks-party-friday": "2010-10-19T23:47:00-07:00",
      "katie-coffee": "2010-10-19T23:41:00-07:00",
    },
    "all late-night pre-session stories must belong to October 19",
  );
  assert.ok(seed.facebook.feed.filter(item => item.origin === "seed").every(item => item.createdAt && facebookStoryTime.isFacebookSeedStoryTimestampValid(item.createdAt, facebookSessionStartMs)), "every Facebook seed story must carry an explicit timestamp before session start");
  assert.equal(facebookStoryTime.isFacebookSeedStoryTimestampValid("2010-10-20T00:03:00-07:00", facebookSessionStartMs), false, "future seed content must fail the strict boundary guard");
  const atThirteenMinutes = facebookSessionStartMs + 11 * 60_000;
  const atThirteen = storyTimestamp => facebookStoryTime.formatFacebookStoryTime({ storyTimestamp, simulatedNowMs: atThirteenMinutes, storyType: "status" });
  assert.deepEqual(
    [atThirteen("2010-10-19T23:58:00-07:00"), atThirteen("2010-10-19T23:52:00-07:00"), atThirteen("2010-10-19T23:47:00-07:00"), atThirteen("2010-10-19T23:41:00-07:00"), atThirteen("2010-10-20T00:03:00-07:00"), atThirteen("2010-10-20T00:04:15-07:00"), atThirteen("2010-10-19T22:00:00-07:00")],
    ["Tue 11:58 PM", "Tue 11:52 PM", "Tue 11:47 PM", "Tue 11:41 PM", "10 minutes ago", "8 minutes ago", "Tue 10:00 PM"],
    "previous-day seed stories must use weekday/time while current-day live stories remain relative",
  );
  const crossMidnightFeedCases = [
    ["luca-main-street-diner-checkin", "2010-10-19T22:44:00-07:00", "checkin", "Tue 10:44 PM"],
    ["luca-pickup-basketball-photos", "2010-10-19T22:58:00-07:00", "album", "Tue 10:58 PM"],
    ["jay-reading", "2010-10-19T23:33:00-07:00", "status", "Tue 11:33 PM"],
    ["katie-coffee", "2010-10-19T23:41:00-07:00", "activity", "Tue 11:41 PM"],
    ["alex-jacks-party-friday", "2010-10-19T23:47:00-07:00", "status", "Tue 11:47 PM"],
    ["jack-movie", "2010-10-19T23:52:00-07:00", "status", "Tue 11:52 PM"],
    ["ben-long-day", "2010-10-19T23:58:00-07:00", "status", "Tue 11:58 PM"],
    ["jay-band-performance-photo", "2010-10-19T22:00:00-07:00", "photo", "Tue 10:00 PM"],
  ];
  assert.deepEqual(crossMidnightFeedCases.map(([storyId, storyTimestamp, storyType]) => [storyId, facebookStoryTime.formatFacebookStoryTime({ storyId, storyTimestamp, simulatedNowMs: atThirteenMinutes, storyType })]), crossMidnightFeedCases.map(([storyId, , , display]) => [storyId, display]), "all Oct 19 Feed metadata must retain Tuesday across midnight");
  assert.equal(facebookStoryTime.formatFacebookStoryTime({ storyId: "ben-long-day", storyTimestamp: "2010-10-19T23:58:00-07:00", simulatedNowMs: atThirteenMinutes, storyType: "status", surface: "detail" }), "October 19, 2010 at 11:58 PM", "Ben Feed and Detail must share the corrected October 19 source timestamp");
  assert.equal(facebookStoryTime.formatFacebookStoryTime({ storyId: "jay-band-performance-photo", storyTimestamp: "2010-10-19T22:00:00-07:00", simulatedNowMs: atThirteenMinutes, storyType: "photo", surface: "detail" }), "October 19, 2010 at 10:00 PM", "Jay Detail must preserve the intentional October 19 upload timestamp");
  assert.deepEqual(
    facebookAlbums.FACEBOOK_ALBUMS.map(album => [album.id, album.ownerActor.displayName, album.title, album.mediaIds, album.photos.map(photo => photo.storyId), album.classification]),
    [
      ["z-tokyo-profile-pictures", "Z.tokyo", "Profile Pictures", ["z-tokyo-profile-picture"], ["z-tokyo-profile-picture-update"], "CURATED"],
      ["luca-pickup-basketball", "Luca", "Pickup Basketball", ["luca-basketball-01", "luca-basketball-02", "luca-basketball-03"], ["luca-pickup-basketball-photos", "luca-pickup-basketball-photos", "luca-pickup-basketball-photos"], "CURATED"],
      ["luca-photos", "Luca", "Photos", ["luca-work-main-street-diner"], ["luca-work-main-street-diner"], "CURATED"],
      ["katie-profile-pictures", "Katie", "Profile Pictures", ["katie-profile-picture"], ["katie-profile-picture-update"], "CURATED"],
      ["katie-photo-history", "Katie", "Photos", ["katie-selfie-september-2010", "katie-selfie-july-2010", "katie-selfie-august-2009", "katie-selfie-july-2009"], ["katie-selfie-september-2010", "katie-selfie-july-2010", "katie-selfie-august-2009", "katie-selfie-july-2009"], "CURATED"],
      ["katie-photos", "Katie", "Family Photos", ["katie-ben-family"], ["katie-photo-with-ben"], "CURATED"],
      ["jay-music", "Jay", "Music", ["jay-band-performance", "jay-guitar", "jay-guitar-may"], ["jay-band-performance-photo", "jay-guitar-photo", "jay-may-guitar-photo"], "CURATED"],
    ],
    "Facebook albums must preserve the exact approved owner/media/story bindings",
  );
  assert.deepEqual(facebookAlbums.FACEBOOK_ALBUMS.map(album => album.mediaIds.length), [1, 3, 1, 1, 4, 1, 3], "album counts must derive from approved media membership");
  assert.equal(facebookActorMedia.getFacebookCanonicalProfileMediaId("katie"), "katie-profile-picture", "Katie03 must be the centralized current Facebook profile picture");
  assert.equal(facebookActorMedia.getFacebookCanonicalProfileMediaId("luca"), "luca-profile-picture", "Luca.png must be the centralized current Facebook profile picture");
  assert.equal(facebookActorMedia.getFacebookCanonicalProfileMediaId("jay"), "facebook-default-avatar", "Jay must use the centralized Facebook default avatar");
  assert.equal(facebookActorMedia.getFacebookEphemeralProfileMediaId("fof-ryan-001"), "facebook-default-avatar", "Ryan must use the centralized Facebook default avatar");
  assert.equal(facebookActorMedia.getFacebookEphemeralProfileMediaId("facebook-ephemeral-frank"), "facebook-default-avatar", "Frank must use the centralized Facebook default avatar");
  const lucaAlbums = facebookAlbums.getFacebookAlbumsForActor({ kind: "canonical", characterId: "luca", displayName: "Luca" });
  assert.deepEqual(lucaAlbums.map(album => [album.id, album.title, album.mediaIds]), [["luca-pickup-basketball", "Pickup Basketball", ["luca-basketball-01", "luca-basketball-02", "luca-basketball-03"]], ["luca-photos", "Photos", ["luca-work-main-street-diner"]]], "Luca albums must use the approved basketball set and one historical work photo");
  assert.deepEqual(lucaAlbums.find(album => album.id === "luca-photos")?.photos.map(photo => [photo.mediaId, photo.timestamp, photo.venueId]), [["luca-work-main-street-diner", "2010-03-20T22:30:00-07:00", "main-street-diner"]], "Luca work history must retain its deterministic March date and canonical venue ID");
  let lucaThreadState = facebook.createInitialFacebookState("Visitor");
  const lucaThreadId = "luca-pickup-basketball-photos";
  const lucaSeedComments = facebook.selectFacebookComments(lucaThreadState, lucaThreadId);
  assert.deepEqual(lucaSeedComments.map(comment => [comment.author, comment.characterId, comment.ephemeralAuthor?.id, comment.text]), [
    ["Chris", "chris", undefined, "my shot was clean tho lol"],
    ["Luca", "luca", undefined, "you missed like 10 before that"],
    ["Chris", "chris", undefined, "details details"],
    ["Frank", undefined, "facebook-ephemeral-frank", "i counted 12 lol"],
  ], "Luca basketball banter must preserve the exact four-comment chronology");
  assert.deepEqual(facebook.selectFacebookLikes(lucaThreadState, lucaThreadId, 0).map(like => [like.id, like.characterId, like.displayName]), [["luca-pickup-basketball-like-chris", "chris", "Chris"]], "Chris must provide exactly one seeded Like on Luca's album story");
  const lucaCommentActors = lucaSeedComments.map(comment => facebook.resolveFacebookCommentActor(comment, "Visitor"));
  assert.deepEqual(lucaCommentActors, [
    { kind: "canonical", characterId: "chris", displayName: "Chris" },
    { kind: "canonical", characterId: "luca", displayName: "Luca" },
    { kind: "canonical", characterId: "chris", displayName: "Chris" },
    { kind: "ephemeral-friend-of-friend", ephemeralId: "facebook-ephemeral-frank", displayName: "Frank", classification: "EPHEMERAL_FRIEND_OF_FRIEND" },
  ], "basketball comment authors must resolve through canonical and ephemeral actor routing");
  assert.equal(coreSocialFriends.CORE_SOCIAL_CHARACTERS.frank, undefined, "Frank must remain outside the canonical character registry");
  lucaThreadState = facebook.facebookStateTransition(lucaThreadState, { type: "SHOW_FEED" });
  lucaThreadState = facebook.facebookStateTransition(lucaThreadState, { type: "OPEN_FEED_ITEM", itemId: lucaThreadId, scrollPosition: 41 });
  const lucaThreadBeforeProfile = [lucaThreadState.selectedFeedItemId, lucaThreadState.scrollPosition, lucaThreadState.comments.length, lucaThreadState.likes.length];
  lucaThreadState = facebook.facebookStateTransition(lucaThreadState, { type: "OPEN_COMMENT_AUTHOR", actor: lucaCommentActors[3] });
  assert.deepEqual([lucaThreadState.currentView, lucaThreadState.selectedProfileName, lucaThreadState.selectedProfileActor?.kind], ["profile", "Frank", "ephemeral-friend-of-friend"], "Frank must open the shared sparse ephemeral Profile route");
  lucaThreadState = facebook.facebookStateTransition(lucaThreadState, { type: "GO_BACK" });
  assert.deepEqual([lucaThreadState.currentView, lucaThreadState.selectedFeedItemId, lucaThreadState.scrollPosition, lucaThreadState.comments.length, lucaThreadState.likes.length], ["feedDetail", ...lucaThreadBeforeProfile], "Frank Profile Back must restore the exact Luca thread state");
  lucaThreadState = facebook.facebookStateTransition(lucaThreadState, { type: "OPEN_COMMENT_AUTHOR", actor: lucaCommentActors[0] });
  assert.deepEqual([lucaThreadState.currentView, lucaThreadState.selectedProfileName], ["profile", "Chris"]);
  lucaThreadState = facebook.facebookStateTransition(lucaThreadState, { type: "GO_BACK" });
  lucaThreadState = facebook.facebookStateTransition(lucaThreadState, { type: "OPEN_COMMENT_AUTHOR", actor: lucaCommentActors[1] });
  assert.deepEqual([lucaThreadState.currentView, lucaThreadState.selectedProfileName], ["profile", "Luca"]);
  lucaThreadState = facebook.facebookStateTransition(lucaThreadState, { type: "GO_BACK" });
  lucaThreadState = facebook.facebookStateTransition(lucaThreadState, { type: "TOGGLE_LIKE", itemId: lucaThreadId, displayName: "Visitor" });
  assert.equal(facebook.selectFacebookLikes(lucaThreadState, lucaThreadId, 0).length, 2, "user Like must increment Luca's real Like records from one to two");
  lucaThreadState = facebook.facebookStateTransition(lucaThreadState, { type: "BEGIN_COMMENT", itemId: lucaThreadId });
  lucaThreadState = facebook.facebookStateTransition(lucaThreadState, { type: "EDIT_COMMENT", value: "good game" });
  lucaThreadState = facebook.facebookStateTransition(lucaThreadState, { type: "SUBMIT_COMMENT", displayName: "Visitor" });
  assert.equal(facebook.selectFacebookComments(lucaThreadState, lucaThreadId).length, 5, "user comment must increment Luca's shared thread from four to five");
  let jayBandThreadState = facebook.createInitialFacebookState("Visitor");
  const jayBandThreadId = "jay-band-performance-photo";
  const jayBandSeedLikes = facebook.selectFacebookLikes(jayBandThreadState, jayBandThreadId, 0);
  assert.deepEqual(jayBandSeedLikes.map(like => like.id), Array.from({ length: 48 }, (_, index) => `jay-band-performance-like-${String(index + 1).padStart(2, "0")}`), "Jay band post must retain exactly 48 deterministic seed Like records");
  const jayBandSeedComments = facebook.selectFacebookComments(jayBandThreadState, jayBandThreadId);
  assert.deepEqual(jayBandSeedComments.map(comment => [comment.id, comment.author, comment.characterId, comment.ephemeralAuthor?.id, comment.text]), [
    ["jay-band-comment-katie", "Katie", "katie", undefined, "wait you guys are actually really good lol"],
    ["jay-band-comment-alex", "Alex", "alex", undefined, "wish i made it lol"],
    ["jay-band-comment-jack", "Jack", "jack", undefined, "nice. you guys killed it"],
    ["jay-band-comment-mike", "Mike", undefined, "facebook-ephemeral-mike", "@Matt bass sounded sick"],
    ["jay-band-comment-sarah", "Sarah", undefined, "facebook-ephemeral-sarah", "who's the drummer?"],
    ["jay-band-comment-kevin", "Kevin", undefined, "facebook-ephemeral-kevin", "that was a good set"],
    ["jay-band-comment-emily", "Emily", undefined, "facebook-ephemeral-emily", "i knew that song!!"],
    ["jay-band-comment-nick", "Nick", undefined, "facebook-ephemeral-nick", "next show when"],
    ["jay-band-comment-rachel", "Rachel", undefined, "facebook-ephemeral-rachel", "so good"],
    ["jay-band-comment-frank", "Frank", undefined, "facebook-ephemeral-frank", "nice set lol"],
    ["jay-band-comment-ryan", "Ryan", undefined, "fof-ryan-001", "looks awesome"],
  ], "Jay band post must retain the exact 11-comment music-circle chronology");
  const mikeBandComment = jayBandSeedComments.find(comment => comment.id === "jay-band-comment-mike");
  assert.deepEqual(mikeBandComment?.mentions, [{ token: "@Matt", actor: { kind: "canonical", characterId: "matt", displayName: "Matt" } }], "Mike's @Matt must use structured canonical mention metadata");
  assert.equal(jayBandSeedComments.filter(comment => comment.characterId === "matt").length, 0, "Matt must not comment on Jay's band post");
  assert.equal(jayBandSeedComments.some(comment => comment.text === "who's the drummer?"), true, "one external commenter must ask about the offline drummer");
  assert.equal(coreSocialFriends.CORE_SOCIAL_CHARACTERS.anil, undefined, "drummer discussion must not create an Anil SNS identity");
  for (const comment of jayBandSeedComments.filter(comment => comment.ephemeralAuthor)) {
    assert.equal(coreSocialFriends.CORE_SOCIAL_CHARACTERS[comment.ephemeralAuthor.id], undefined, `${comment.author} must remain outside the canonical registry`);
  }
  jayBandThreadState = facebook.facebookStateTransition(jayBandThreadState, { type: "SHOW_FEED" });
  jayBandThreadState = facebook.facebookStateTransition(jayBandThreadState, { type: "OPEN_FEED_ITEM", itemId: jayBandThreadId, scrollPosition: 52 });
  jayBandThreadState = facebook.facebookStateTransition(jayBandThreadState, { type: "OPEN_COMMENT_AUTHOR", actor: mikeBandComment.mentions[0].actor });
  assert.deepEqual([jayBandThreadState.currentView, jayBandThreadState.selectedProfileName], ["profile", "Matt"], "Mike's structured @Matt must open canonical Matt Profile");
  jayBandThreadState = facebook.facebookStateTransition(jayBandThreadState, { type: "GO_BACK" });
  assert.deepEqual([jayBandThreadState.currentView, jayBandThreadState.selectedFeedItemId, jayBandThreadState.scrollPosition], ["feedDetail", jayBandThreadId, 52], "Matt mention Back must restore Jay's band thread");
  jayBandThreadState = facebook.facebookStateTransition(jayBandThreadState, { type: "TOGGLE_LIKE", itemId: jayBandThreadId, displayName: "Visitor" });
  assert.equal(facebook.selectFacebookLikes(jayBandThreadState, jayBandThreadId, 0).length, 49, "user Like must increment Jay's band post from 48 to 49");
  jayBandThreadState = facebook.facebookStateTransition(jayBandThreadState, { type: "TOGGLE_LIKE", itemId: jayBandThreadId, displayName: "Visitor" });
  assert.equal(facebook.selectFacebookLikes(jayBandThreadState, jayBandThreadId, 0).length, 48, "Unlike must restore Jay's deterministic 48-Like baseline");
  jayBandThreadState = facebook.facebookStateTransition(jayBandThreadState, { type: "BEGIN_COMMENT", itemId: jayBandThreadId });
  jayBandThreadState = facebook.facebookStateTransition(jayBandThreadState, { type: "EDIT_COMMENT", value: "great show" });
  jayBandThreadState = facebook.facebookStateTransition(jayBandThreadState, { type: "SUBMIT_COMMENT", displayName: "Visitor" });
  assert.equal(facebook.selectFacebookComments(jayBandThreadState, jayBandThreadId).length, 12, "user comment must increment Jay's band post from 11 to 12");
  const lucaBasketballMediaIds = ["luca-basketball-01", "luca-basketball-02", "luca-basketball-03"];
  assert.equal(lucaBasketballMediaIds.every(mediaId => facebookStoryMedia.getFacebookStoryMedia(mediaId)?.src), true, "all three Luca Feed preview records must resolve through the centralized story-media path");
  for (const mediaId of lucaBasketballMediaIds) {
    let lucaPhotoNavigation = facebook.createInitialFacebookState("Visitor");
    lucaPhotoNavigation = facebook.facebookStateTransition(lucaPhotoNavigation, { type: "OPEN_PROFILE", profileName: "Luca" });
    lucaPhotoNavigation = facebook.facebookStateTransition(lucaPhotoNavigation, { type: "SET_PROFILE_SECTION", section: "photos" });
    lucaPhotoNavigation = facebook.facebookStateTransition(lucaPhotoNavigation, { type: "OPEN_ALBUM", albumId: "luca-pickup-basketball" });
    lucaPhotoNavigation = facebook.facebookStateTransition(lucaPhotoNavigation, { type: "OPEN_ALBUM_PHOTO", albumId: "luca-pickup-basketball", mediaId });
    assert.deepEqual([lucaPhotoNavigation.currentView, lucaPhotoNavigation.selectedAlbumId, lucaPhotoNavigation.selectedPhotoMediaId], ["photoDetail", "luca-pickup-basketball", mediaId], `${mediaId} must open through the shared Photo Detail route`);
    lucaPhotoNavigation = facebook.facebookStateTransition(lucaPhotoNavigation, { type: "GO_BACK" });
    assert.deepEqual([lucaPhotoNavigation.currentView, lucaPhotoNavigation.selectedAlbumId], ["album", "luca-pickup-basketball"], `${mediaId} Back must restore Pickup Basketball`);
  }
  let lucaWorkNavigation = facebook.createInitialFacebookState("Visitor");
  lucaWorkNavigation = facebook.facebookStateTransition(lucaWorkNavigation, { type: "OPEN_PROFILE", profileName: "Luca" });
  lucaWorkNavigation = facebook.facebookStateTransition(lucaWorkNavigation, { type: "SET_PROFILE_SECTION", section: "photos" });
  lucaWorkNavigation = facebook.facebookStateTransition(lucaWorkNavigation, { type: "OPEN_ALBUM", albumId: "luca-photos" });
  lucaWorkNavigation = facebook.facebookStateTransition(lucaWorkNavigation, { type: "OPEN_ALBUM_PHOTO", albumId: "luca-photos", mediaId: "luca-work-main-street-diner" });
  assert.deepEqual([lucaWorkNavigation.currentView, lucaWorkNavigation.selectedAlbumId, lucaWorkNavigation.selectedPhotoMediaId], ["photoDetail", "luca-photos", "luca-work-main-street-diner"], "Luca work photo must open through the shared Photo Detail route");
  lucaWorkNavigation = facebook.facebookStateTransition(lucaWorkNavigation, { type: "TOGGLE_LIKE", itemId: "luca-work-main-street-diner", displayName: "Visitor" });
  lucaWorkNavigation = facebook.facebookStateTransition(lucaWorkNavigation, { type: "BEGIN_COMMENT", itemId: "luca-work-main-street-diner" });
  lucaWorkNavigation = facebook.facebookStateTransition(lucaWorkNavigation, { type: "EDIT_COMMENT", value: "late shift" });
  lucaWorkNavigation = facebook.facebookStateTransition(lucaWorkNavigation, { type: "SUBMIT_COMMENT", displayName: "Visitor" });
  assert.equal(lucaWorkNavigation.likedItemIds.includes("luca-work-main-street-diner"), true, "Luca work Photo Detail must retain the canonical story Like state");
  assert.equal(facebook.selectFacebookComments(lucaWorkNavigation, "luca-work-main-street-diner").some(comment => comment.text === "late shift"), true, "Luca work Photo Detail must retain the canonical story comment thread");
  lucaWorkNavigation = facebook.facebookStateTransition(lucaWorkNavigation, { type: "GO_BACK" });
  assert.deepEqual([lucaWorkNavigation.currentView, lucaWorkNavigation.selectedAlbumId], ["album", "luca-photos"], "work photo Back must restore Luca Photos");
  const katieAlbums = facebookAlbums.getFacebookAlbumsForActor({ kind: "canonical", characterId: "katie", displayName: "Katie" });
  assert.deepEqual(katieAlbums.map(album => [album.id, album.title]), [["katie-profile-pictures", "Profile Pictures"], ["katie-photo-history", "Photos"], ["katie-photos", "Family Photos"]]);
  assert.deepEqual(katieAlbums.find(album => album.id === "katie-photo-history")?.photos.map(photo => [photo.mediaId, photo.timestamp, photo.caption]), [["katie-selfie-september-2010", "2010-09-11T14:00:00-07:00", undefined], ["katie-selfie-july-2010", "2010-07-17T15:00:00-07:00", undefined], ["katie-selfie-august-2009", "2009-08-22T16:00:00-07:00", "summer :)"], ["katie-selfie-july-2009", "2009-07-18T17:00:00-07:00", undefined]], "Katie selfie history must be deterministic and newest-first with one restrained caption");
  const jayMusicAlbum = facebookAlbums.getFacebookAlbum("jay-music");
  assert.deepEqual(jayMusicAlbum.photos.map(photo => [photo.mediaId, photo.timestamp, photo.caption]), [
    ["jay-band-performance", "2010-10-19T22:00:00-07:00", "last night was awesome. thx @Matt @Z.tokyo @Anil"],
    ["jay-guitar", "2010-10-17T21:12:00-07:00", undefined],
    ["jay-guitar-may", "2010-05-15T18:00:00-07:00", "hey baby"],
  ], "Jay Music must sort photo records newest-first by in-world timestamp");
  assert.equal(facebookAlbums.FACEBOOK_ALBUMS.filter(album => album.ownerActor.kind === "canonical" && album.ownerActor.characterId === "jay").length, 1, "Jay must retain exactly one Music album");
  assert.equal(facebookAlbums.getFacebookAlbumsForActor({ kind: "session-user", displayName: "Visitor" }).length, 0, "root Photos must remain the current user's empty baseline");
  assert.equal(facebookAlbums.getFacebookAlbumsForActor({ kind: "ephemeral-friend-of-friend", ephemeralId: "facebook-ephemeral-ryan", displayName: "Ryan", classification: "EPHEMERAL_FRIEND_OF_FRIEND" }).length, 0, "Ryan must retain an empty Photos surface");
  assert.equal(facebookAlbums.FACEBOOK_ALBUMS.some(album => album.ownerActor.displayName === "Anil"), false, "offline-only Anil must not receive a Facebook album");

  let facebookPhotoNavigation = facebook.createInitialFacebookState("Visitor");
  facebookPhotoNavigation = facebook.facebookStateTransition(facebookPhotoNavigation, { type: "OPEN_PROFILE", profileName: "Jay" });
  facebookPhotoNavigation = facebook.facebookStateTransition(facebookPhotoNavigation, { type: "SET_PROFILE_SECTION", section: "photos" });
  facebookPhotoNavigation = facebook.facebookStateTransition(facebookPhotoNavigation, { type: "OPEN_ALBUM", albumId: "jay-music" });
  facebookPhotoNavigation = facebook.facebookStateTransition(facebookPhotoNavigation, { type: "OPEN_ALBUM_PHOTO", albumId: "jay-music", mediaId: "jay-guitar" });
  assert.deepEqual([facebookPhotoNavigation.currentView, facebookPhotoNavigation.selectedAlbumId, facebookPhotoNavigation.selectedPhotoMediaId], ["photoDetail", "jay-music", "jay-guitar"]);
  facebookPhotoNavigation = facebook.facebookStateTransition(facebookPhotoNavigation, { type: "TOGGLE_LIKE", itemId: "jay-guitar-photo", displayName: "Visitor" });
  facebookPhotoNavigation = facebook.facebookStateTransition(facebookPhotoNavigation, { type: "BEGIN_COMMENT", itemId: "jay-guitar-photo" });
  facebookPhotoNavigation = facebook.facebookStateTransition(facebookPhotoNavigation, { type: "EDIT_COMMENT", value: "nice" });
  facebookPhotoNavigation = facebook.facebookStateTransition(facebookPhotoNavigation, { type: "SUBMIT_COMMENT", displayName: "Visitor" });
  assert.equal(facebookPhotoNavigation.likedItemIds.includes("jay-guitar-photo"), true, "Photo Detail must share the Feed story Like ID");
  assert.equal(facebook.selectFacebookComments(facebookPhotoNavigation, "jay-guitar-photo").some(comment => comment.text === "nice"), true, "Photo Detail must share the Feed story comment thread");
  facebookPhotoNavigation = facebook.facebookStateTransition(facebookPhotoNavigation, { type: "GO_BACK" });
  assert.equal(facebookPhotoNavigation.currentView, "album", "Photo Back must restore the originating album");
  facebookPhotoNavigation = facebook.facebookStateTransition(facebookPhotoNavigation, { type: "GO_BACK" });
  assert.deepEqual([facebookPhotoNavigation.currentView, facebookPhotoNavigation.profileSection], ["profile", "photos"], "Album Back must restore the same Profile Photos section");
  assert.equal(coreSocialFriends.CORE_SOCIAL_CHARACTERS.june.socialHandles.instagram, "junepark", "June's Instagram username must remain canonical and session-independent");
  assert.deepEqual(coreSocialFriends.CORE_SOCIAL_FRIEND_IDS, ["katie", "matt", "alex", "chris", "jay"]);
  assert.deepEqual(
    Object.values(coreSocialFriends.CORE_SOCIAL_FRIENDS).map(friend => [friend.id, friend.displayName, friend.fictional]),
    [["katie", "Katie", true], ["matt", "Matt", true], ["alex", "Alex", true], ["chris", "Chris", true], ["jay", "Jay", true]],
    "core social friend identities must remain centralized and immutable",
  );
  const timelineDefinitions = sessionTimeline.SESSION_TIMELINE_EVENTS;
  const expectedTimeline = [
    ["initial-sms-mom-home-yet", 60, "initialSMS"],
    ["facebook-june-instagram-announcement", 60, "facebookJuneInstagramAnnouncement"],
    ["twitter-slang-epic-fail", 75, "twitterBackgroundTweet"],
    ["facebook-june-jack-gossip-katie", 120, "facebookJuneJackGossip"],
    ["facebook-june-jack-gossip-ryan-standalone", 135, "facebookEphemeralGossip"],
    ["facebook-june-jack-gossip-chris", 145, "facebookJuneJackGossip"],
    ["facebook-jack-request", 150, "facebookJackRequest"],
    ["facebook-katie-jack-gossip-message", 155, "facebookKatieGossipMessage"],
    ["instagram-june-jack-accidental-delete", 200, "instagramJuneDelete"],
    ["instagram-june-replacement-photo", 210, "instagramJunePost"],
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
  assert.deepEqual(facebookA.friends.map(friend => friend.id), ["katie", "matt", "alex", "chris", "jay", "june", "ben", "luca"], "Friends must begin with the canonical Facebook social circle except pending Jack");
  assert.deepEqual(facebook.selectFacebookPeopleSearchResults("june"), [{ kind: "canonical", characterId: "june", displayName: "June" }]);
  assert.deepEqual(facebook.selectFacebookPeopleSearchResults("Z.tokyo"), [{ kind: "author-easter-egg", authorId: "author-z-tokyo", displayName: "Z.tokyo" }]);
  assert.deepEqual(facebook.selectFacebookPeopleSearchResults("Anil"), [], "offline Anil must not become a searchable Facebook account");
  assert.equal(facebook.selectFacebookRequestCount(facebookA), 0);
  assert.equal(facebook.selectFacebookInboxUnreadCount(facebookA), 0);
  assert.equal(facebookA.friendRequestState, "none");
  assert.equal(facebook.selectFacebookJuneMessageState(facebookA), "none");
  assert.ok(facebookA.inboxThreads.every(thread => thread.origin === "seed" && thread.status === "read"));
  assert.deepEqual(facebookA.inboxThreads.map(thread => [thread.friendId, thread.sender]), [["katie", "Katie"], ["jay", "Jay"]]);
  assert.deepEqual([...new Set(facebookA.feed.filter(item => item.friendId).map(item => item.friendId))].sort(), ["alex", "ben", "jack", "jay", "katie", "luca"]);
  assert.deepEqual([...new Set(facebookA.feed.map(item => item.kind))].sort(), ["activity", "album", "checkin", "photo", "status"], "Facebook seed must exercise every locked story structure");
  assert.ok(facebookA.feed.every(item => ["friends", "friends-of-friends", "everyone", "custom"].includes(item.visibility)), "every Facebook story must carry a visibility scope");
  assert.equal(facebook.selectFacebookVisibleFeed(facebookA).some(item => item.id === "jack-movie"), false, "Jack friends-only content must remain hidden before acceptance");
  assert.equal(facebookA.feed.some(item => item.id === "facebook-june-instagram-announcement"), false, "June's Instagram announcement must not exist before T+60");
  const zTokyoPost = facebookA.feed.find(item => item.id === "z-tokyo-profile-picture-update");
  assert.deepEqual(
    [zTokyoPost?.actor, zTokyoPost?.author, zTokyoPost?.text, zTokyoPost?.mediaId, zTokyoPost?.createdAt],
    [{ kind: "author-easter-egg", authorId: "author-z-tokyo" }, "Z.tokyo", "updated her profile picture.", "z-tokyo-profile-picture", "2010-10-18T20:52:00-07:00"],
  );
  const zTokyoMedia = facebookMedia.getFacebookMedia(zTokyoPost?.mediaId);
  assert.deepEqual(zTokyoMedia?.intendedUses, ["profile-picture", "wall-activity", "photos", "profile-pictures-album"]);
  assert.deepEqual(zTokyoMedia?.surfaceStatus, { profilePicture: "READY", wallActivity: "READY", photos: "READY", profilePicturesAlbum: "READY" });
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
    ["luca", 3, ["chris"], "HOLD"],
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
  assert.equal(facebook.selectFacebookNotificationUnreadCount(facebookA), 2, "Notifications must derive Jack and June unread activity from shared state");
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
  junePartyState = facebook.facebookStateTransition(junePartyState, { type: "EDIT_MESSAGE_REPLY", value: "Still awake." });
  junePartyState = facebook.facebookStateTransition(junePartyState, { type: "SUBMIT_MESSAGE_REPLY", displayName: "Zoey", timestamp: "12:06 AM" });
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
  assert.equal(facebook.selectFacebookNotifications(sharedPartyState).find(notification => notification.target === "event")?.unread, true, "delivered party invite must drive one unread Events notification");
  let partyEventState = facebook.facebookStateTransition(sharedPartyState, { type: "SHOW_EVENTS" });
  partyEventState = facebook.facebookStateTransition(partyEventState, { type: "OPEN_PARTY_EVENT" });
  assert.equal(partyEventState.partyInviteState, "opened", "Events must expose the same shared party invitation state");
  assert.equal(partyEventState.inboxThreads.find(thread => thread.id === facebook.FACEBOOK_PARTY_INVITE_EVENT_ID)?.status, "read");
  assert.equal(partyEventState.partyRsvp, null, "party RSVP must remain empty until explicit user action");
  partyEventState = facebook.facebookStateTransition(partyEventState, { type: "SET_PARTY_RSVP", value: "maybe" });
  assert.equal(partyEventState.partyRsvp, "maybe");
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
  let facebookStatus = facebook.facebookStateTransition(facebook.createInitialFacebookState("Zoey"), { type: "SHOW_FEED" });
  assert.equal(facebookStatus.feed.some(item => item.origin === "user"), false, "Facebook must not seed user-owned status content");
  facebookStatus = facebook.facebookStateTransition(facebookStatus, { type: "OPEN_STATUS_COMPOSER" });
  facebookStatus = facebook.facebookStateTransition(facebookStatus, { type: "EDIT_STATUS", value: "My own status" });
  facebookStatus = facebook.facebookStateTransition(facebookStatus, { type: "SUBMIT_STATUS", displayName: "Zoey", timestamp: "12:09 AM" });
  assert.deepEqual(
    [facebookStatus.feed[0].author, facebookStatus.feed[0].text, facebookStatus.feed[0].timestamp, facebookStatus.feed[0].origin, facebookStatus.feed[0].contentStatus],
    ["Zoey", "My own status", "12:09 AM", "user", "USER-GENERATED"],
    "only explicit Status submission may create owner-authored Facebook content",
  );
  let facebookPlaces = facebook.facebookStateTransition(facebook.createInitialFacebookState("Zoey"), { type: "SHOW_PLACES" });
  assert.equal(facebookPlaces.userCheckIn, null, "Facebook Places must not seed a user location");
  facebookPlaces = facebook.facebookStateTransition(facebookPlaces, { type: "CHECK_IN", venueId: "downtown-coffee", displayName: "Zoey", timestamp: "12:10 AM" });
  assert.deepEqual(facebookPlaces.userCheckIn, { venueId: "downtown-coffee", venueName: "Downtown Coffee", author: "Zoey", timestamp: "12:10 AM", origin: "user" });
  assert.deepEqual(facebook.FACEBOOK_FRIEND_CHECK_INS.map(checkIn => checkIn.characterId), ["ben", "chris", "luca"]);
  assert.equal(facebook.FACEBOOK_CHAT_ROSTER.some(person => person.characterId === "anil"), false);
  assert.deepEqual(facebookMedia.FACEBOOK_MEDIA_IDS, ["z-tokyo-profile-picture", "facebook-default-avatar"], "Facebook-local media must centralize the author portrait and shared default actor avatar");
  assert.deepEqual([facebookMedia.getFacebookMedia("facebook-default-avatar")?.originalFilename, facebookMedia.getFacebookMedia("facebook-default-avatar")?.classification], ["01.png", "CURATED / FACEBOOK_DEFAULT"]);

  let facebookInbox = facebook.facebookStateTransition(facebookA, { type: "SHOW_INBOX" });
  assert.equal(facebook.selectFacebookInboxUnreadCount(facebookInbox), 1, "opening Inbox alone must not clear June unread");
  facebookInbox = facebook.facebookStateTransition(facebookInbox, { type: "OPEN_MESSAGE", messageId: "june-live-message" });
  assert.equal(facebook.selectFacebookInboxUnreadCount(facebookInbox), 0, "opening June must clear only its thread unread state");
  facebookInbox = facebook.facebookStateTransition(facebookInbox, { type: "GO_BACK" });
  assert.equal(facebookInbox.currentView, "inbox", "June Back must return to Inbox");

  let facebookAccept = facebook.facebookStateTransition(facebookA, { type: "ACCEPT_JACK" });
  assert.equal(facebookAccept.friendRequestState, "accepted");
  assert.deepEqual(facebookAccept.friends.map(friend => friend.id), ["katie", "matt", "alex", "chris", "jay", "june", "ben", "luca", "jack"], "accepting Jack must append one session-local friend to the baseline circle");
  facebookAccept = facebook.facebookStateTransition(facebookAccept, { type: "SHOW_FRIENDS" });
  assert.equal(facebookAccept.currentView, "friends");
  assert.equal(facebookAccept.friends.some(friend => friend.id === "jack"), true, "accepted Jack must be available from Friends");
  assert.equal(facebook.selectFacebookRequestCount(facebookAccept), 0, "accepted request must leave no pending count");
  facebookAccept = facebook.facebookStateTransition(facebookAccept, { type: "DELIVER_JACK_REQUEST" });
  assert.equal(facebookAccept.friends.length, 9, "Jack request must not recreate or duplicate after acceptance");
  let facebookIgnore = facebook.facebookStateTransition(
    facebook.facebookStateTransition(facebook.createInitialFacebookState("Zoey"), { type: "DELIVER_JACK_REQUEST" }),
    { type: "IGNORE_JACK" },
  );
  assert.equal(facebookIgnore.friendRequestState, "ignored");
  assert.deepEqual(facebookIgnore.friends.map(friend => friend.id), ["katie", "matt", "alex", "chris", "jay", "june", "ben", "luca"], "ignoring Jack must not add him to baseline Friends");
  facebookIgnore = facebook.facebookStateTransition(facebookIgnore, { type: "DELIVER_JACK_REQUEST" });
  assert.equal(facebookIgnore.friendRequestState, "ignored", "ignored request must not be recreated");

  let facebookPlayability = facebook.facebookStateTransition(facebookA, { type: "OPEN_JUNE_MESSAGE" });
  assert.equal(facebook.selectFacebookJuneMessageState(facebookPlayability), "read", "opening June must mark only the live June message read");
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "EDIT_MESSAGE_REPLY", value: "Still awake." });
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "SUBMIT_MESSAGE_REPLY", displayName: "Zoey", timestamp: "12:06 AM" });
  assert.equal(facebook.selectFacebookJuneMessageState(facebookPlayability), "replied");
  assert.deepEqual(facebook.selectFacebookThreadMessages(facebookPlayability, "june-live-message").filter(message => message.origin === "user").map(message => [message.author, message.body, message.timestamp]), [["Zoey", "Still awake.", "12:06 AM"]]);
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "OPEN_FEED_ITEM", itemId: "jack-movie", scrollPosition: 96 });
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "BEGIN_COMMENT", itemId: "jack-movie" });
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "EDIT_COMMENT", value: "I thought so too." });
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "SUBMIT_COMMENT", displayName: "Zoey" });
  facebookPlayability = facebook.facebookStateTransition(facebookPlayability, { type: "TOGGLE_LIKE", itemId: "jack-movie" });
  assert.deepEqual(facebookPlayability.comments.filter(comment => comment.origin === "user"), [{ id: "facebook-comment-1", itemId: "jack-movie", author: "Zoey", text: "I thought so too.", origin: "user" }]);
  assert.deepEqual(facebook.selectFacebookComments(facebookPlayability, "alex-jacks-party-friday").map(comment => [comment.author, comment.origin]), [["Jay", "seed"], ["Ryan", "seed"]], "Alex's baseline discussion must remain exactly Jay and Ryan regardless of unrelated story comments");
  assert.deepEqual(facebookPlayability.likedItemIds, ["jack-movie"]);
  assert.equal(facebook.selectFacebookJuneMessageState(facebookPlayability), "replied", "Feed interaction must not mutate June state");
  assert.deepEqual(facebookPlayability.friends.map(friend => friend.id), ["katie", "matt", "alex", "chris", "jay", "june", "ben", "luca"], "Feed and message interaction must not mutate Friends state");
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
  assert.equal(userTweetReset.timeline.find(tweet => tweet.id === "late-night-matt")?.displayName, "Matt", "session reset must preserve canonical ownership of Matt's seed Tweet");
  assert.equal(userTweetReset.timeline.some(tweet => tweet.id === "late-night-user" || tweet.displayName === "session-owner"), false, "Twitter seed must not contain pre-authored session-owner content");
  const scheduledTwitterPosts = timelineDefinitions
    .filter(event => event.payload?.kind === "twitter-post")
    .map(event => event.payload.post);
  assert.equal(scheduledTwitterPosts.length, 6, "Twitter must be the most active social app with six live additions");
  const liveCountsBySocialApp = timelineDefinitions
    .filter(event => event.sourceApp !== "messages")
    .reduce((counts, event) => ({ ...counts, [event.sourceApp]: (counts[event.sourceApp] ?? 0) + 1 }), {});
  assert.equal(liveCountsBySocialApp.twitter, 6, "Twitter live volume must remain unchanged");
  assert.equal(liveCountsBySocialApp.facebook, 7, "Facebook includes the intentional T+135 standalone friend-of-friend gossip event");
  assert.ok(Object.entries(liveCountsBySocialApp).every(([app, count]) => app === "twitter" || app === "facebook" || count < liveCountsBySocialApp.twitter), "Facebook has seven and Twitter six live events while every other social app remains sparser");
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
  assert.equal(twitterReset.timeline.find(tweet => tweet.id === "late-night-matt").displayName, "Matt");

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
  foursquarePlayability = foursquare.foursquareStateTransition(foursquarePlayability, { type: "OPEN_VENUE", venueId: "main-street-diner", scrollPosition: 73 });
  foursquarePlayability = foursquare.foursquareStateTransition(foursquarePlayability, {
    type: "CHECK_IN",
    venueId: "main-street-diner",
    checkedInBy: "Zoey",
    checkInTimestamp: 1_287_552_720_000,
  });
  assert.equal(foursquarePlayability.checkIns["main-street-diner"].shout, null, "empty shout must still permit check-in");
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
  assert.deepEqual({ photos: instagramState.photos.length, followers: instagramState.followers, following: instagram.selectInstagramFollowingCount(instagramState) }, { photos: 0, followers: 0, following: 1 });
  assert.equal(instagramState.knownAccounts.length, 1, "Instagram must remain sparse with exactly one familiar early adopter");
  assert.deepEqual(instagramState.knownAccounts.map(account => account.canonicalCharacterId), ["june"], "Instagram must not auto-populate any other canonical character");
  assert.equal(new Set(instagramState.knownAccounts.map(account => account.canonicalCharacterId)).size, instagramState.knownAccounts.length, "Instagram must not duplicate canonical identities");
  assert.deepEqual(instagramState.followedCharacterIds, ["june"], "the Instagram relationship baseline must follow canonical June");
  assert.deepEqual(instagram.selectInstagramFollowedAccounts(instagramState).map(account => [account.canonicalCharacterId, account.username]), [["june", "junepark"]], "Following must contain exactly canonical June");
  const juneInstagramAccount = instagram.selectInstagramKnownAccountByUsername(instagramState, "@junepark");
  assert.deepEqual(
    [juneInstagramAccount?.canonicalCharacterId, juneInstagramAccount?.username, juneInstagramAccount?.displayName, juneInstagramAccount?.followersBaseline, juneInstagramAccount?.followingBaseline],
    ["june", "junepark", "June", 118, 236],
  );
  assert.equal(juneInstagramAccount?.username, coreSocialFriends.CORE_SOCIAL_CHARACTERS.june.socialHandles.instagram, "Facebook and Instagram must resolve the same canonical June handle");
  assert.deepEqual([juneInstagramAccount?.discoveryUiStatus, juneInstagramAccount?.followUiStatus, juneInstagramAccount?.profileUiStatus], ["READY", "READY", "HOLD"]);
  assert.deepEqual(sharedCharacterMedia.SHARED_CHARACTER_MEDIA_IDS, ["june-ig-01", "june-ig-02", "june-ig-03", "june-ig-04", "june-profile-avatar", "katie-ben-family", "jay-guitar", "jay-guitar-may", "jay-band-performance", "katie-selfie-july-2009", "katie-selfie-august-2009", "katie-profile-picture", "katie-selfie-july-2010", "katie-selfie-september-2010", "luca-profile-picture", "luca-basketball-01", "luca-basketball-02", "luca-basketball-03", "luca-work-main-street-diner"]);
  assert.deepEqual(
    sharedCharacterMedia.SHARED_CHARACTER_MEDIA_IDS.map(id => {
      const media = sharedCharacterMedia.getSharedCharacterMedia(id);
      return [media.id, media.originalFilename, media.canonicalCharacterId, media.platform, media.timestamp, media.role, media.initialVisibility];
    }),
    [
      ["june-ig-01", "IG01.JPG", "june", "instagram", "2010-10-20T00:05:30-07:00", "replacement", "hidden"],
      ["june-ig-02", "IG02.JPG", "june", "instagram", "2010-10-15", "nightclub-dancing", "visible"],
      ["june-ig-03", "IG03.JPG", "june", "instagram", "2010-10-16", "party", "visible"],
      ["june-ig-04", "IG04.JPG", "june", "instagram", "2010-10-20T00:00:00-07:00", "accidental-intimate", "visible"],
      ["june-profile-avatar", "June01.PNG", "june", "instagram", "2010-10-20", "profile-avatar", "visible"],
      ["katie-ben-family", "Katie-Ben.JPG", "katie", "facebook", "2010-10-18T19:24:00-07:00", "family-context", "visible"],
      ["jay-guitar", "Jay01.PNG", "jay", "facebook", "2010-10-17T21:12:00-07:00", "music-context", "visible"],
      ["jay-guitar-may", "Jay02.PNG", "jay", "facebook", "2010-05-15T18:00:00-07:00", "music-guitar-still-life", "visible"],
      ["jay-band-performance", "10-18.JPG", "jay", "facebook", "2010-10-19T22:00:00-07:00", "band-performance", "visible"],
      ["katie-selfie-july-2009", "Katie01.jpg", "katie", "facebook", "2009-07-18T17:00:00-07:00", "facebook-selfie", "visible"],
      ["katie-selfie-august-2009", "Katie02.jpg", "katie", "facebook", "2009-08-22T16:00:00-07:00", "facebook-selfie", "visible"],
      ["katie-profile-picture", "Katie03.PNG", "katie", "facebook", "2010-10-10T16:00:00-07:00", "facebook-profile-picture", "visible"],
      ["katie-selfie-july-2010", "Katie04.jpg", "katie", "facebook", "2010-07-17T15:00:00-07:00", "facebook-selfie", "visible"],
      ["katie-selfie-september-2010", "Katie05.jpg", "katie", "facebook", "2010-09-11T14:00:00-07:00", "facebook-selfie", "visible"],
      ["luca-profile-picture", "Luca.png", "luca", "facebook", "2010-10-20", "facebook-profile-picture", "visible"],
      ["luca-basketball-01", "guys.png", "luca", "facebook", "2010-10-19T22:58:00-07:00", "basketball-friends", "visible"],
      ["luca-basketball-02", "guys02.PNG", "luca", "facebook", "2010-10-19T22:58:00-07:00", "basketball-friends", "visible"],
      ["luca-basketball-03", "guys03.png", "luca", "facebook", "2010-10-19T22:58:00-07:00", "basketball-friends", "visible"],
      ["luca-work-main-street-diner", "Luca-work.png", "luca", "facebook", "2010-03-20T22:30:00-07:00", "restaurant-work", "visible"],
    ],
  );
  assert.deepEqual(
    instagram.selectInstagramVisibleKnownPosts(instagramState, "june").map(post => [post.id, post.mediaId, post.timestamp, post.origin]),
    [
      ["june-ig-04", "june-ig-04", "2010-10-20T00:00:00-07:00", "seed"],
      ["june-ig-03", "june-ig-03", "2010-10-16", "seed"],
      ["june-ig-02", "june-ig-02", "2010-10-15", "seed"],
    ],
    "June profile must begin with the locked IG04 / IG03 / IG02 chronology",
  );
  const juneStatsAtSessionStart = instagram.selectInstagramKnownAccountStats(instagramState, "june");
  assert.deepEqual(juneStatsAtSessionStart, { posts: 3, followers: 118, following: 236 }, "June stats must combine curated social baselines with the visible-media count");
  assert.deepEqual(instagram.selectInstagramKnownAccountStats(instagramState, "june"), juneStatsAtSessionStart, "June social stats must be deterministic");
  assert.equal(instagramState.knownAccountPosts.some(post => post.id === "june-ig-01"), false, "IG01 must not be visible or instantiated at session start");
  let followingNavigationState = instagram.instagramStateTransition(instagramState, { type: "SHOW_PROFILE" });
  followingNavigationState = instagram.instagramStateTransition(followingNavigationState, { type: "SHOW_FOLLOWING" });
  assert.deepEqual([followingNavigationState.currentView, instagram.selectInstagramFollowingCount(followingNavigationState)], ["following", 1]);
  followingNavigationState = instagram.instagramStateTransition(followingNavigationState, { type: "OPEN_KNOWN_PROFILE", characterId: "june" });
  assert.deepEqual([followingNavigationState.currentView, followingNavigationState.selectedKnownCharacterId, followingNavigationState.knownProfileOrigin], ["knownProfile", "june", "following"]);
  assert.deepEqual(instagram.selectInstagramVisibleKnownPosts(followingNavigationState, "june").map(post => post.id), ["june-ig-04", "june-ig-03", "june-ig-02"], "Following-opened June must use the canonical profile media selector");
  followingNavigationState = instagram.instagramStateTransition(followingNavigationState, { type: "SHOW_KNOWN_CONNECTIONS", kind: "following" });
  assert.deepEqual([followingNavigationState.currentView, followingNavigationState.selectedKnownCharacterId, followingNavigationState.knownConnectionsKind], ["knownConnections", "june", "following"]);
  followingNavigationState = instagram.instagramStateTransition(followingNavigationState, { type: "BACK_FROM_DISCOVERY" });
  assert.equal(followingNavigationState.currentView, "knownProfile");
  followingNavigationState = instagram.instagramStateTransition(followingNavigationState, { type: "BACK_FROM_DISCOVERY" });
  assert.equal(followingNavigationState.currentView, "following");
  followingNavigationState = instagram.instagramStateTransition(followingNavigationState, { type: "BACK_FROM_DISCOVERY" });
  assert.equal(followingNavigationState.currentView, "profile");
  assert.equal(timelineDefinitions.some(event => event.id === "instagram-june-jack-accidental-photo" || event.atElapsedSeconds === 80 && event.type === "instagramJunePost"), false, "IG04 must be seed content with no T+80 creation event");
  assert.equal(instagramPopular.INSTAGRAM_POPULAR_POSTS.length, 20, "Popular must register all twenty local photos in deterministic order");
  assert.equal(new Set(instagramPopular.INSTAGRAM_POPULAR_POSTS.map(post => post.id)).size, 20);
  assert.ok(instagramPopular.INSTAGRAM_POPULAR_POSTS.every(post => post.classification === "EPHEMERAL_INSTAGRAM_USER" && post.mediaStatus === "CURATED_LOCAL_ASSET" && typeof post.media === "string" && post.media.length > 0));
  assert.ok(instagramPopular.INSTAGRAM_POPULAR_POSTS.every(post => post.username !== "junepark" && post.canonicalCharacterId === undefined), "June and the canonical nine must not be inserted into Popular");
  const popularOrder = instagramPopular.INSTAGRAM_POPULAR_POSTS.map(post => post.id);
  let popularState = instagram.instagramStateTransition(instagramState, { type: "SHOW_POPULAR" });
  assert.equal(popularState.currentView, "popular");
  popularState = instagram.instagramStateTransition(popularState, { type: "SET_POPULAR_SCROLL_POSITION", scrollPosition: 87 });
  popularState = instagram.instagramStateTransition(popularState, { type: "REFRESH_POPULAR" });
  assert.deepEqual([popularState.popularScrollPosition, popularState.popularRefreshCount, instagramPopular.INSTAGRAM_POPULAR_POSTS.map(post => post.id)], [87, 1, popularOrder], "Popular refresh must retain deterministic ordering and local scroll state");
  popularState = instagram.instagramStateTransition(popularState, { type: "OPEN_POPULAR_PHOTO", postId: popularOrder[0] });
  assert.deepEqual([popularState.currentView, popularState.selectedPopularPostId], ["popularPhotoDetail", popularOrder[0]]);
  assert.equal(instagramPopular.getInstagramPopularPost(popularOrder[0]).media, instagramPopular.INSTAGRAM_POPULAR_POSTS[0].media, "Popular thumbnail and Photo Detail must resolve the same media record");
  popularState = instagram.instagramStateTransition(popularState, { type: "BACK_FROM_POPULAR_PHOTO" });
  assert.deepEqual([popularState.currentView, popularState.selectedPopularPostId, popularState.popularScrollPosition], ["popular", null, 87], "Popular Photo Detail Back must restore Popular and its scroll position");
  let dramaFacebook = facebook.createInitialFacebookState("Zoey");
  let dramaInstagram = instagram.createInitialInstagramState();
  const partyStateBeforeDrama = [dramaFacebook.partyInviteState, dramaFacebook.partyInviteEligibleFromJune, dramaFacebook.partyInviteEligibleFromJack, dramaFacebook.partyRsvp, dramaFacebook.friendRequestState];
  dramaFacebook = facebook.facebookStateTransition(dramaFacebook, { type: "DELIVER_JUNE_INSTAGRAM_ANNOUNCEMENT", timestamp: "12:03 AM" });
  dramaFacebook = facebook.facebookStateTransition(dramaFacebook, { type: "DELIVER_JUNE_INSTAGRAM_ANNOUNCEMENT", timestamp: "12:03 AM" });
  const juneInstagramPost = dramaFacebook.feed.find(item => item.id === "facebook-june-instagram-announcement");
  assert.deepEqual([juneInstagramPost?.friendId, juneInstagramPost?.text, juneInstagramPost?.timestamp, juneInstagramPost?.origin], ["june", "finally got instagram lol @junepark", "12:03 AM", "live"]);
  assert.deepEqual([60, 90, 120, 150, 210, 300].map(second => facebook.selectFacebookLikes(dramaFacebook, "facebook-june-instagram-announcement", second).length), [1, 3, 5, 7, 9, 11], "June like growth must be deterministic and record-derived");
  assert.equal(facebook.selectFacebookNotifications(dramaFacebook).length, 0, "June like growth must not create notification spam");
  assert.equal(dramaFacebook.feed.filter(item => item.id === "facebook-june-instagram-announcement").length, 1, "June announcement must deliver exactly once");
  dramaFacebook = facebook.facebookStateTransition(dramaFacebook, { type: "DELIVER_JUNE_JACK_GOSSIP", reactionId: "facebook-june-jack-gossip-katie", characterId: "katie", text: "june + jack???" });
  dramaFacebook = facebook.facebookStateTransition(dramaFacebook, { type: "DELIVER_EPHEMERAL_GOSSIP", postId: "facebook-june-jack-gossip-ryan-standalone", ephemeralId: "fof-ryan-001", text: "june + jack??? lol", timestamp: "12:04 AM" });
  dramaFacebook = facebook.facebookStateTransition(dramaFacebook, { type: "DELIVER_EPHEMERAL_GOSSIP", postId: "facebook-june-jack-gossip-ryan-standalone", ephemeralId: "fof-ryan-001", text: "june + jack??? lol", timestamp: "12:04 AM" });
  dramaFacebook = facebook.facebookStateTransition(dramaFacebook, { type: "DELIVER_JUNE_JACK_GOSSIP", reactionId: "facebook-june-jack-gossip-chris", characterId: "chris", text: "lol no way" });
  dramaFacebook = facebook.facebookStateTransition(dramaFacebook, { type: "DELIVER_KATIE_GOSSIP_MESSAGE", timestamp: "12:04 AM" });
  assert.deepEqual(dramaFacebook.comments.filter(comment => comment.itemId === "facebook-june-instagram-announcement").map(comment => [comment.id, comment.characterId, comment.text]), [["facebook-june-jack-gossip-katie", "katie", "june + jack???"], ["facebook-june-jack-gossip-chris", "chris", "lol no way"]]);
  assert.equal(dramaFacebook.comments.some(comment => comment.itemId === "facebook-june-instagram-announcement" && comment.characterId === "jay"), false, "Jay must have no June/Jack gossip activity");
  const standaloneGossip = dramaFacebook.feed.filter(item => item.id === "facebook-june-jack-gossip-ryan-standalone");
  assert.equal(standaloneGossip.length, 1, "exactly one ephemeral standalone June/Jack gossip post may exist");
  assert.deepEqual([standaloneGossip[0].actor, standaloneGossip[0].friendId, standaloneGossip[0].author, standaloneGossip[0].text, standaloneGossip[0].visibility, standaloneGossip[0].origin], [{ kind: "ephemeral-friend-of-friend", ephemeralId: "fof-ryan-001" }, undefined, "Ryan", "june + jack??? lol", "friends-of-friends", "live"]);
  assert.equal(coreSocialFriends.CORE_SOCIAL_CHARACTERS[standaloneGossip[0].actor.ephemeralId], undefined, "standalone gossip author must not be canonical");
  assert.deepEqual(timelineDefinitions.find(event => event.id === "facebook-june-jack-gossip-ryan-standalone")?.atElapsedSeconds, 135);
  assert.deepEqual(dramaFacebook.comments.filter(comment => comment.itemId === "facebook-june-instagram-announcement").map(comment => comment.text), ["june + jack???", "lol no way"]);
  assert.deepEqual(dramaFacebook.inboxThreads.find(thread => thread.id === "facebook-katie-jack-gossip-message"), { id: "facebook-katie-jack-gossip-message", friendId: "katie", sender: "Katie", preview: "Do you know Jack????", timestamp: "12:04 AM", status: "unread", origin: "live" });
  assert.equal(facebook.selectFacebookNotifications(dramaFacebook).filter(notification => notification.id === "facebook-notification-katie-gossip-message").length, 1, "Katie's unread message must drive one derived notification");
  const partyBeforeKatieReply = [dramaFacebook.partyInviteState, dramaFacebook.partyInviteEligibleFromJune, dramaFacebook.partyInviteEligibleFromJack, dramaFacebook.partyRsvp, dramaFacebook.friendRequestState];
  dramaFacebook = facebook.facebookStateTransition(dramaFacebook, { type: "OPEN_MESSAGE", messageId: "facebook-katie-jack-gossip-message" });
  assert.equal(dramaFacebook.inboxThreads.find(thread => thread.id === "facebook-katie-jack-gossip-message")?.status, "read", "opening Katie must clear the thread-derived unread state");
  dramaFacebook = facebook.facebookStateTransition(dramaFacebook, { type: "EDIT_MESSAGE_REPLY", value: "   " });
  dramaFacebook = facebook.facebookStateTransition(dramaFacebook, { type: "SUBMIT_MESSAGE_REPLY", displayName: "Zoey", timestamp: "12:05 AM" });
  assert.equal(facebook.selectFacebookThreadMessages(dramaFacebook, "facebook-katie-jack-gossip-message").length, 1, "whitespace-only Facebook replies must not send");
  dramaFacebook = facebook.facebookStateTransition(dramaFacebook, { type: "EDIT_MESSAGE_REPLY", value: "  who?  " });
  dramaFacebook = facebook.facebookStateTransition(dramaFacebook, { type: "SUBMIT_MESSAGE_REPLY", displayName: "Zoey", timestamp: "12:05 AM" });
  assert.deepEqual(facebook.selectFacebookThreadMessages(dramaFacebook, "facebook-katie-jack-gossip-message").map(message => [message.authorType, message.author, message.body, message.timestamp, message.origin]), [["character", "Katie", "Do you know Jack????", "12:04 AM", "live"], ["session-user", "Zoey", "  who?  ", "12:05 AM", "user"]]);
  assert.deepEqual([dramaFacebook.partyInviteState, dramaFacebook.partyInviteEligibleFromJune, dramaFacebook.partyInviteEligibleFromJack, dramaFacebook.partyRsvp, dramaFacebook.friendRequestState], partyBeforeKatieReply, "Katie reply must remain independent from Jack and party state");
  assert.equal(facebook.selectFacebookNotifications(dramaFacebook).find(notification => notification.id === "facebook-notification-katie-gossip-message")?.unread, false, "sending a reply must not create self-unread state");
  const persistedKatieMessages = facebook.selectFacebookThreadMessages(facebook.facebookStateTransition(facebook.facebookStateTransition(dramaFacebook, { type: "SHOW_HOME" }), { type: "OPEN_MESSAGE", messageId: "facebook-katie-jack-gossip-message" }), "facebook-katie-jack-gossip-message");
  assert.equal(persistedKatieMessages.filter(message => message.origin === "user").length, 1, "Facebook reply must persist across navigation without duplication");
  dramaInstagram = instagram.instagramStateTransition(dramaInstagram, { type: "DELETE_KNOWN_ACCOUNT_POST", postId: "june-ig-04" });
  assert.deepEqual(instagram.selectInstagramVisibleKnownPosts(dramaInstagram, "june").map(post => post.id), ["june-ig-03", "june-ig-02"], "deleted IG04 must disappear while older seed posts remain");
  assert.deepEqual(instagram.selectInstagramKnownAccountStats(dramaInstagram, "june"), { posts: 2, followers: 118, following: 236 }, "IG04 deletion must decrement only June's derived post count");
  assert.equal(dramaFacebook.comments.filter(comment => comment.itemId === "facebook-june-instagram-announcement").length, 2, "Facebook gossip must persist after Instagram deletion");
  assert.equal(dramaFacebook.feed.filter(item => item.id === "facebook-june-jack-gossip-ryan-standalone").length, 1, "standalone gossip must remain after IG04 deletion");
  assert.equal(dramaFacebook.feed.some(item => item.friendId === "jay" && /june|jack/.test(item.text) && item.id !== "alex-jacks-party-friday"), false, "Jay must have no standalone June/Jack gossip post");
  assert.equal(dramaFacebook.feed.some(item => item.friendId === "matt" && /june|jack/.test(item.text)), false, "Matt must have no June/Jack gossip post");
  dramaInstagram = instagram.instagramStateTransition(dramaInstagram, { type: "DELIVER_KNOWN_ACCOUNT_POST", post: { id: "june-ig-01", mediaId: "june-ig-01", timestamp: "2010-10-20T00:05:30-07:00" } });
  assert.deepEqual(instagram.selectInstagramVisibleKnownPosts(dramaInstagram, "june").map(post => [post.id, post.mediaId]), [["june-ig-01", "june-ig-01"], ["june-ig-03", "june-ig-03"], ["june-ig-02", "june-ig-02"]]);
  assert.deepEqual(instagram.selectInstagramKnownAccountStats(dramaInstagram, "june"), { posts: 3, followers: 118, following: 236 }, "IG01 replacement must restore June's derived post count");
  assert.equal(dramaInstagram.knownAccountPosts.find(post => post.id === "june-ig-04")?.status, "deleted", "IG04 deletion must persist after IG01 appears");
  assert.deepEqual([dramaFacebook.partyInviteState, dramaFacebook.partyInviteEligibleFromJune, dramaFacebook.partyInviteEligibleFromJack, dramaFacebook.partyRsvp, dramaFacebook.friendRequestState], partyStateBeforeDrama, "Instagram drama must not mutate party, RSVP, or Jack request state");
  let interactionFacebook = facebook.createInitialFacebookState("Zoey");
  interactionFacebook = facebook.facebookStateTransition(interactionFacebook, { type: "BEGIN_COMMENT", itemId: "ben-long-day" });
  interactionFacebook = facebook.facebookStateTransition(interactionFacebook, { type: "EDIT_COMMENT", value: "same" });
  interactionFacebook = facebook.facebookStateTransition(interactionFacebook, { type: "SUBMIT_COMMENT", displayName: "Zoey" });
  assert.equal(facebook.formatFacebookCommentCount(facebook.selectFacebookComments(interactionFacebook, "ben-long-day").length), "1 comment");
  interactionFacebook = facebook.facebookStateTransition(interactionFacebook, { type: "BEGIN_COMMENT", itemId: "ben-long-day" });
  interactionFacebook = facebook.facebookStateTransition(interactionFacebook, { type: "EDIT_COMMENT", value: "really" });
  interactionFacebook = facebook.facebookStateTransition(interactionFacebook, { type: "SUBMIT_COMMENT", displayName: "Zoey" });
  assert.equal(facebook.formatFacebookCommentCount(facebook.selectFacebookComments(interactionFacebook, "ben-long-day").length), "2 comments");
  interactionFacebook = facebook.facebookStateTransition(interactionFacebook, { type: "TOGGLE_LIKE", itemId: "ben-long-day", displayName: "Zoey" });
  assert.deepEqual(facebook.selectFacebookLikes(interactionFacebook, "ben-long-day", 0).map(like => [like.displayName, like.origin]), [["Zoey", "user"]]);
  let commentNavigation = facebook.facebookStateTransition(facebook.createInitialFacebookState("Zoey"), { type: "SHOW_FEED" });
  commentNavigation = facebook.facebookStateTransition(commentNavigation, { type: "OPEN_FEED_ITEM", itemId: "alex-jacks-party-friday", scrollPosition: 84 });
  const commentStateBeforeProfile = [commentNavigation.selectedFeedItemId, commentNavigation.scrollPosition, commentNavigation.comments.length, commentNavigation.likes.length, commentNavigation.partyInviteState];
  const jayComment = commentNavigation.comments.find(comment => comment.id === "alex-party-comment-jay");
  const jayActor = facebook.resolveFacebookCommentActor(jayComment, "Zoey");
  assert.deepEqual(jayActor, { kind: "canonical", characterId: "jay", displayName: "Jay" });
  commentNavigation = facebook.facebookStateTransition(commentNavigation, { type: "OPEN_COMMENT_AUTHOR", actor: jayActor });
  assert.deepEqual([commentNavigation.currentView, commentNavigation.selectedProfileName, commentNavigation.selectedProfileActor], ["profile", "Jay", jayActor]);
  commentNavigation = facebook.facebookStateTransition(commentNavigation, { type: "GO_BACK" });
  assert.deepEqual([commentNavigation.currentView, commentNavigation.selectedFeedItemId, commentNavigation.scrollPosition, commentNavigation.comments.length, commentNavigation.likes.length, commentNavigation.partyInviteState], ["feedDetail", ...commentStateBeforeProfile]);
  const ryanComment = commentNavigation.comments.find(comment => comment.id === "alex-party-comment-ryan");
  const ryanActor = facebook.resolveFacebookCommentActor(ryanComment, "Zoey");
  assert.deepEqual(ryanActor, { kind: "ephemeral-friend-of-friend", ephemeralId: "fof-ryan-001", displayName: "Ryan", classification: "EPHEMERAL_FRIEND_OF_FRIEND" });
  commentNavigation = facebook.facebookStateTransition(commentNavigation, { type: "OPEN_COMMENT_AUTHOR", actor: ryanActor });
  assert.deepEqual([commentNavigation.currentView, commentNavigation.selectedProfileName, commentNavigation.selectedProfileActor?.kind], ["profile", "Ryan", "ephemeral-friend-of-friend"]);
  assert.equal(coreSocialFriends.CORE_SOCIAL_CHARACTERS.ryan, undefined, "Ryan must remain outside the canonical character registry");
  commentNavigation = facebook.facebookStateTransition(commentNavigation, { type: "GO_BACK" });
  commentNavigation = facebook.facebookStateTransition(commentNavigation, { type: "BEGIN_COMMENT", itemId: "alex-jacks-party-friday" });
  commentNavigation = facebook.facebookStateTransition(commentNavigation, { type: "EDIT_COMMENT", value: "user note" });
  commentNavigation = facebook.facebookStateTransition(commentNavigation, { type: "SUBMIT_COMMENT", displayName: "Zoey" });
  assert.equal(facebook.selectFacebookComments(commentNavigation, "alex-jacks-party-friday").length, 3, "one user comment must coexist with Alex's two scoped baseline comments");
  const userCommentActor = facebook.resolveFacebookCommentActor(commentNavigation.comments.find(comment => comment.origin === "user"), "Zoey");
  assert.deepEqual(userCommentActor, { kind: "session-user", displayName: "Zoey" }, "session-user comments must route to the current user Profile");
  const lucaAlbum = interactionFacebook.feed.find(item => item.id === "luca-pickup-basketball-photos");
  const katiePhoto = interactionFacebook.feed.find(item => item.id === "katie-photo-with-ben");
  assert.deepEqual([lucaAlbum?.kind, lucaAlbum?.mediaId, lucaAlbum?.mediaIds, lucaAlbum?.photoCount, lucaAlbum?.text, lucaAlbum?.relatedCharacterIds], ["album", "luca-basketball-01", ["luca-basketball-01", "luca-basketball-02", "luca-basketball-03"], 3, "added 3 new photos from pickup basketball.", ["chris"]]);
  const lucaCheckIn = interactionFacebook.feed.find(item => item.id === "luca-main-street-diner-checkin");
  const lucaWorkPhoto = interactionFacebook.feed.find(item => item.id === "luca-work-main-street-diner");
  const foursquareMainStreetDiner = seed.foursquare.venues.find(venue => venue.id === "main-street-diner");
  assert.deepEqual([lucaCheckIn?.venueId, lucaWorkPhoto?.venueId, foursquareMainStreetDiner?.id, foursquareMainStreetDiner?.name], ["main-street-diner", "main-street-diner", "main-street-diner", "Main Street Diner"], "Facebook check-in, work photo and Foursquare must share one canonical Main Street Diner identity");
  assert.equal(seed.foursquare.venues.filter(venue => venue.id === "main-street-diner").length, 1, "Main Street Diner must have exactly one Foursquare venue record");
  assert.deepEqual([katiePhoto?.kind, katiePhoto?.mediaId, katiePhoto?.relatedCharacterIds], ["photo", "katie-ben-family", ["ben"]]);
  assert.equal(interactionFacebook.feed.some(item => item.mediaId === "june-ig-04" || item.mediaIds?.includes("june-ig-04")), false, "IG04 must remain Instagram-only");
  assert.deepEqual(facebook.FACEBOOK_OFFLINE_PERSON_IDS, ["anil"], "Facebook story metadata must support Anil only as an offline subject");
  const jayBandPost = interactionFacebook.feed.find(item => item.id === "jay-band-performance-photo");
  const jayMayPost = interactionFacebook.feed.find(item => item.id === "jay-may-guitar-photo");
  assert.deepEqual([jayBandPost?.mediaId, jayBandPost?.createdAt, jayBandPost?.text, jayBandPost?.relatedCharacterIds, jayBandPost?.offlineSubjectIds], ["jay-band-performance", "2010-10-19T22:00:00-07:00", "last night was awesome. thx @Matt @Z.tokyo @Anil", ["matt"], ["anil"]]);
  assert.deepEqual(jayBandPost?.mentions, [
    { token: "@Matt", actor: { kind: "canonical", characterId: "matt", displayName: "Matt" } },
    { token: "@Z.tokyo", actor: { kind: "author-easter-egg", authorId: "author-z-tokyo", displayName: "Z.tokyo" } },
  ], "only Facebook-backed Jay caption identities may receive structured mention mappings");
  assert.equal(jayBandPost?.mentions?.some(mention => mention.token === "@Anil"), false, "offline-only @Anil must remain plain text");
  assert.deepEqual([jayMayPost?.mediaId, jayMayPost?.createdAt, jayMayPost?.text, jayMayPost?.visibility, jayMayPost?.customAudienceIncludesUser], ["jay-guitar-may", "2010-05-15T18:00:00-07:00", "hey baby", "custom", false]);
  assert.equal(facebook.selectFacebookVisibleFeed(interactionFacebook).some(item => item.id === "jay-may-guitar-photo"), false, "May history must not enter the current News Feed");
  assert.equal(coreSocialFriends.CORE_SOCIAL_CHARACTERS.anil, undefined, "plain-text @Anil must not create a canonical SNS identity");
  const katieSeptemberComments = facebook.selectFacebookComments(interactionFacebook, "katie-selfie-september-2010");
  assert.deepEqual(katieSeptemberComments.map(comment => [comment.author, comment.characterId, comment.text, comment.classification]), [["Ben", "ben", "do you own any other shirts?", "CURATED / SIBLING BANTER"]]);
  assert.equal(facebook.selectFacebookComments(interactionFacebook, "alex-jacks-party-friday").some(comment => comment.id === "katie-september-comment-ben" || comment.characterId === "ben"), false, "Katie's Ben seed comment must not enter Alex's discussion");
  let katiePhotoNavigation = facebook.facebookStateTransition(facebook.createInitialFacebookState("Zoey"), { type: "OPEN_PROFILE", profileName: "Katie" });
  katiePhotoNavigation = facebook.facebookStateTransition(katiePhotoNavigation, { type: "SET_PROFILE_SECTION", section: "photos" });
  katiePhotoNavigation = facebook.facebookStateTransition(katiePhotoNavigation, { type: "OPEN_ALBUM", albumId: "katie-photo-history" });
  katiePhotoNavigation = facebook.facebookStateTransition(katiePhotoNavigation, { type: "OPEN_ALBUM_PHOTO", albumId: "katie-photo-history", mediaId: "katie-selfie-september-2010" });
  const katiePhotoState = [katiePhotoNavigation.selectedAlbumId, katiePhotoNavigation.selectedPhotoMediaId, katiePhotoNavigation.comments.length];
  const benPhotoActor = facebook.resolveFacebookCommentActor(facebook.selectFacebookComments(katiePhotoNavigation, "katie-selfie-september-2010")[0], "Zoey");
  katiePhotoNavigation = facebook.facebookStateTransition(katiePhotoNavigation, { type: "OPEN_COMMENT_AUTHOR", actor: benPhotoActor });
  assert.deepEqual([katiePhotoNavigation.currentView, katiePhotoNavigation.selectedProfileName, katiePhotoNavigation.selectedProfileActor], ["profile", "Ben", { kind: "canonical", characterId: "ben", displayName: "Ben" }]);
  katiePhotoNavigation = facebook.facebookStateTransition(katiePhotoNavigation, { type: "GO_BACK" });
  assert.deepEqual([katiePhotoNavigation.currentView, katiePhotoNavigation.selectedAlbumId, katiePhotoNavigation.selectedPhotoMediaId, katiePhotoNavigation.comments.length], ["photoDetail", ...katiePhotoState]);
  katiePhotoNavigation = facebook.facebookStateTransition(katiePhotoNavigation, { type: "BEGIN_COMMENT", itemId: "katie-selfie-september-2010" });
  katiePhotoNavigation = facebook.facebookStateTransition(katiePhotoNavigation, { type: "EDIT_COMMENT", value: "haha" });
  katiePhotoNavigation = facebook.facebookStateTransition(katiePhotoNavigation, { type: "SUBMIT_COMMENT", displayName: "Zoey" });
  assert.equal(facebook.selectFacebookComments(katiePhotoNavigation, "katie-selfie-september-2010").length, 2, "Katie photo comment count must derive from real records");
  assert.deepEqual([formatFacebookTime("12:03 AM", 60), formatFacebookTime("12:03 AM", 480)], ["just now", "7 minutes ago"], "June live metadata must advance from the simulated clock");
  assert.deepEqual([formatFacebookTime("12:04 AM", 180), formatFacebookTime("12:04 AM", 480)], ["1 minute ago", "6 minutes ago"], "Ryan live metadata must advance from the simulated clock");
  assert.deepEqual([interactionFacebook.feed.find(item => item.id === "jay-band-performance-photo")?.createdAt, interactionFacebook.feed.find(item => item.id === "luca-pickup-basketball-photos")?.createdAt], ["2010-10-19T22:00:00-07:00", "2010-10-19T22:58:00-07:00"], "formatter integration must not rewrite static story timestamps");
  interactionFacebook = facebook.facebookStateTransition(interactionFacebook, { type: "TOGGLE_LIKE", itemId: "jay-band-performance-photo", displayName: "Zoey" });
  assert.equal(interactionFacebook.likedItemIds.includes("jay-band-performance-photo"), true, "Feed and album performance photo must share one story interaction ID");
  interactionFacebook = facebook.facebookStateTransition(interactionFacebook, { type: "SHOW_FEED" });
  interactionFacebook = facebook.facebookStateTransition(interactionFacebook, { type: "OPEN_FEED_ITEM", itemId: "jay-band-performance-photo", scrollPosition: 73 });
  const jayMentionState = [interactionFacebook.selectedFeedItemId, interactionFacebook.scrollPosition, interactionFacebook.likedItemIds, interactionFacebook.comments.length, interactionFacebook.partyInviteState];
  interactionFacebook = facebook.facebookStateTransition(interactionFacebook, { type: "OPEN_COMMENT_AUTHOR", actor: jayBandPost.mentions[0].actor });
  assert.deepEqual([interactionFacebook.currentView, interactionFacebook.selectedProfileName, interactionFacebook.selectedProfileActor], ["profile", "Matt", { kind: "canonical", characterId: "matt", displayName: "Matt" }]);
  interactionFacebook = facebook.facebookStateTransition(interactionFacebook, { type: "GO_BACK" });
  assert.deepEqual([interactionFacebook.currentView, interactionFacebook.selectedFeedItemId, interactionFacebook.scrollPosition, interactionFacebook.likedItemIds, interactionFacebook.comments.length, interactionFacebook.partyInviteState], ["feedDetail", ...jayMentionState], "Matt mention Back must restore the exact Jay Post state");
  interactionFacebook = facebook.facebookStateTransition(interactionFacebook, { type: "OPEN_COMMENT_AUTHOR", actor: jayBandPost.mentions[1].actor });
  assert.deepEqual([interactionFacebook.currentView, interactionFacebook.selectedProfileName, interactionFacebook.selectedProfileActor], ["profile", "Z.tokyo", { kind: "author-easter-egg", authorId: "author-z-tokyo", displayName: "Z.tokyo" }]);
  interactionFacebook = facebook.facebookStateTransition(interactionFacebook, { type: "GO_BACK" });
  assert.deepEqual([interactionFacebook.currentView, interactionFacebook.selectedFeedItemId, interactionFacebook.scrollPosition, interactionFacebook.likedItemIds, interactionFacebook.comments.length, interactionFacebook.partyInviteState], ["feedDetail", ...jayMentionState], "Z.tokyo mention Back must restore the exact Jay Post state");
  interactionFacebook = facebook.facebookStateTransition(interactionFacebook, { type: "DELIVER_JACK_REQUEST" });
  interactionFacebook = facebook.facebookStateTransition(interactionFacebook, { type: "ACCEPT_JACK" });
  assert.equal(facebook.selectFacebookVisibleFeed(interactionFacebook).some(item => item.id === "jack-movie"), true, "Jack friends-only content may become visible only after acceptance");
  dramaInstagram = instagram.instagramStateTransition(dramaInstagram, { type: "SHOW_PROFILE" });
  dramaInstagram = instagram.instagramStateTransition(dramaInstagram, { type: "SHOW_FACEBOOK_FRIENDS" });
  dramaInstagram = instagram.instagramStateTransition(dramaInstagram, { type: "OPEN_KNOWN_PROFILE", characterId: "june" });
  assert.deepEqual([dramaInstagram.currentView, dramaInstagram.selectedKnownCharacterId], ["knownProfile", "june"]);
  assert.deepEqual([dramaInstagram.followedCharacterIds, instagram.selectInstagramFollowingCount(dramaInstagram)], [["june"], 1], "Following button and count must share the relationship graph");
  dramaInstagram = instagram.instagramStateTransition(dramaInstagram, { type: "SET_KNOWN_ACCOUNT_FOLLOWING", characterId: "june", following: false });
  assert.deepEqual([dramaInstagram.followedCharacterIds, instagram.selectInstagramFollowingCount(dramaInstagram)], [[], 0]);
  assert.deepEqual(instagram.selectInstagramKnownAccountStats(dramaInstagram, "june"), { posts: 3, followers: 117, following: 236 }, "explicit Unfollow may change June's follower display without changing her own Following baseline");
  dramaInstagram = instagram.instagramStateTransition(dramaInstagram, { type: "SET_KNOWN_ACCOUNT_FOLLOWING", characterId: "june", following: true });
  assert.deepEqual([dramaInstagram.followedCharacterIds, instagram.selectInstagramFollowingCount(dramaInstagram)], [["june"], 1]);
  assert.deepEqual(instagram.selectInstagramKnownAccountStats(dramaInstagram, "june"), { posts: 3, followers: 118, following: 236 });
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
  assert.deepEqual({ followers: instagramState.followers, following: instagram.selectInstagramFollowingCount(instagramState) }, { followers: 0, following: 1 });
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
  facebookZoey = facebook.facebookStateTransition(facebookZoey, { type: "EDIT_MESSAGE_REPLY", value: "yes" });
  facebookZoey = facebook.facebookStateTransition(facebookZoey, { type: "SUBMIT_MESSAGE_REPLY", displayName: "Zoey", timestamp: "12:06 AM" });
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
  assert.deepEqual(facebookAlex.friends.map(friend => friend.id), ["katie", "matt", "alex", "chris", "jay", "june", "ben", "luca"]);
  assert.deepEqual([facebookAlex.statusDraft, facebookAlex.statusComposerOpen, facebookAlex.partyRsvp, facebookAlex.userCheckIn, facebookAlex.readNotificationIds], ["", false, null, null, []], "new session must clear Facebook v0.3 user actions and notification reads");
  assert.equal(facebook.selectFacebookJuneMessageState(facebookAlex), "none");
  assert.equal(facebookAlex.threadMessages.some(message => message.origin === "user"), false);
  assert.equal(facebookAlex.messageReplyDraft, "");
  assert.deepEqual(facebookAlex.comments.map(comment => comment.id), ["alex-party-comment-jay", "alex-party-comment-ryan", "katie-september-comment-ben", "luca-basketball-comment-chris-shot", "luca-basketball-comment-luca-misses", "luca-basketball-comment-chris-details", "luca-basketball-comment-frank-count", "jay-band-comment-katie", "jay-band-comment-alex", "jay-band-comment-jack", "jay-band-comment-mike", "jay-band-comment-sarah", "jay-band-comment-kevin", "jay-band-comment-emily", "jay-band-comment-nick", "jay-band-comment-rachel", "jay-band-comment-frank", "jay-band-comment-ryan"]);
  assert.deepEqual(facebookAlex.likes.map(like => like.id), ["luca-pickup-basketball-like-chris", ...Array.from({ length: 48 }, (_, index) => `jay-band-performance-like-${String(index + 1).padStart(2, "0")}`)], "new session must restore the complete deterministic Facebook seed Like baseline");
  assert.equal(facebookAlex.commentComposerItemId, null);
  assert.equal(facebookAlex.commentDraft, "");
  assert.equal(facebookAlex.inboxThreads.some(thread => thread.id === "june-live-message"), false);
  assert.deepEqual(
    [facebookAlex.feed.find(item => item.id === "ben-long-day")?.friendId, facebookAlex.feed.find(item => item.id === "ben-long-day")?.author],
    ["ben", "Ben"],
    "new session must preserve canonical ownership of Ben's seed Feed item",
  );
  assert.equal(facebookAlex.feed.some(item => item.id === "owner-late" || item.author === "session-owner"), false, "Facebook seed must not contain pre-authored session-owner content");
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
  assert.deepEqual({ followers: instagramAlex.followers, following: instagram.selectInstagramFollowingCount(instagramAlex) }, { followers: 0, following: 1 });
  assert.deepEqual(instagramAlex.knownAccounts.map(account => [account.canonicalCharacterId, account.username]), [["june", "junepark"]], "new session must restore the sparse canonical June mapping");
  assert.deepEqual(instagram.selectInstagramVisibleKnownPosts(instagramAlex, "june").map(post => post.id), ["june-ig-04", "june-ig-03", "june-ig-02"], "new session must restore the locked June seed chronology");
  assert.deepEqual(instagram.selectInstagramKnownAccountStats(instagramAlex, "june"), { posts: 3, followers: 118, following: 236 }, "new session must restore June's curated display baseline");
  assert.deepEqual([instagramAlex.followedCharacterIds, instagramAlex.selectedKnownCharacterId, instagramAlex.knownProfileOrigin], [["june"], null, null], "new session must restore June Follow baseline and clear profile navigation state");
  assert.deepEqual([instagramAlex.popularScrollPosition, instagramAlex.selectedPopularPostId, instagramAlex.popularRefreshCount], [0, null, 0], "new session must reset Instagram Popular navigation state");

  const seedSource = await readFile(resolve(projectRoot, "src/data/sessionSeedContent.ts"), "utf8");
  const coreSocialSource = await readFile(resolve(projectRoot, "src/data/coreSocialFriends.ts"), "utf8");
  const instagramStateSource = await readFile(resolve(projectRoot, "src/state/instagramState.ts"), "utf8");
  const instagramContainerSource = await readFile(resolve(projectRoot, "src/device/InstagramContainer.tsx"), "utf8");
  const facebookContainerSource = await readFile(resolve(projectRoot, "src/device/FacebookContainer.tsx"), "utf8");
  const facebookStoryTimeSource = await readFile(resolve(projectRoot, "src/data/facebookStoryTime.ts"), "utf8");
  const twitterContainerSource = await readFile(resolve(projectRoot, "src/device/TwitterContainer.tsx"), "utf8");
  const deviceCssSource = await readFile(resolve(projectRoot, "src/styles/device.css"), "utf8");
  const timelineCellSource = twitterContainerSource.match(/function TimelineTweet[\s\S]*?function TweetDetail/)?.[0] ?? "";
  const facebookProfileSource = facebookContainerSource.match(/function FacebookProfile[\s\S]*?function FacebookCommentRow/)?.[0] ?? "";
  assert.doesNotMatch(seedSource, /DeviceAudio|deviceEventScheduler|smsNotification/, "seed definitions must not depend on delivery systems");
  assert.doesNotMatch(`${seedSource}\n${coreSocialSource}\n${instagramStateSource}`, /juneph[o]to/, "runtime/data must contain no superseded June Instagram handle");
  assert.doesNotMatch(instagramStateSource, /Math\.random|followerDrift|liveFollowerDrift/, "ordinary fictional June must not receive render-time randomization or celebrity follower drift");
  assert.match(instagramContainerSource, /viewTitle\(state\.currentView, selectedKnownAccount\?\.username/, "June's username must supply the other-user profile navigation title");
  assert.match(instagramContainerSource, /instagram-profile-photo-stream/, "Instagram 1.0 profiles must use a vertical photo stream");
  assert.doesNotMatch(instagramContainerSource, /instagram-known-photo-grid|profile-bio|Story Highlights|Reels/, "June profile must not contain post-2010 grid, bio, Story, or Reels UI");
  assert.match(instagramContainerSource, /getSharedCharacterMedia\("june-profile-avatar"\)/, "June's profile and stream avatar must resolve through shared media");
  assert.match(instagramContainerSource, />Popular<\/button>/, "Popular must be a functional root tab");
  assert.match(instagramContainerSource, />Share<\/button>/, "the center Instagram tab must use Share semantics");
  assert.match(instagramContainerSource, /instagramAccountTabLabel\(identity\.name\)/, "the rightmost tab must derive current-account identity");
  assert.match(deviceCssSource, /\.instagram-popular-grid\s*\{[^}]*grid-template-columns:\s*repeat\(4,1fr\)[^}]*overflow-y:\s*auto/, "Popular must use a vertically scrolling four-column grid");
  assert.match(deviceCssSource, /\.instagram-popular-grid\s*>\s*button\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1/, "Popular thumbnails must remain square");
  assert.doesNotMatch(instagramContainerSource, /Explore|category chips|Suggested for You|Reels|instagram-popular-search/, "Popular must not introduce modern Explore UI");
  assert.match(deviceCssSource, /\.instagram-square-photo\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1/, "June Instagram media must use a square presentation surface");
  assert.match(deviceCssSource, /\.instagram-square-photo img\s*\{[^}]*width:\s*100%[^}]*height:\s*100%[^}]*object-fit:\s*cover/, "square Instagram images must fill their 1:1 surface without stretching");
  assert.match(facebookContainerSource, /getFacebookStoryMedia\(mediaId\)/, "Facebook Feed must resolve local and shared story media through the centralized registry resolver");
  assert.match(facebookContainerSource, /getFacebookAlbumByStoryId\(item\.id\)/, "Feed media must route through the centralized album registry");
  assert.doesNotMatch(facebookContainerSource, /assets\/facebook\/characters|assets\/characters/, "Facebook UI components must not import character image files directly");
  assert.match(facebookProfileSource, /const profileMediaId = authorIdentity\?\.profileMediaId \?\? \(canonicalCharacter \? getFacebookCanonicalProfileMediaId\(canonicalCharacter\.id\) : null\) \?\? ephemeralProfileMediaId/, "Facebook Profile media ID must derive from author, canonical, or ephemeral actor-media mapping");
  assert.match(facebookProfileSource, /const profileMedia = profileMediaId \? getFacebookStoryMedia\(profileMediaId\) : null/, "Facebook Profile must resolve its actor-derived media ID through the shared story-media resolver");
  assert.doesNotMatch(facebookContainerSource, /Reply unavailable in v0\.2/, "all open Facebook message threads must expose the shared reply composer");
  assert.match(facebookContainerSource, /SUBMIT_MESSAGE_REPLY/, "Facebook Messages must use the shared thread reply mechanism");
  assert.match(facebookContainerSource, /OPEN_COMMENT_AUTHOR/, "Facebook comment author names must route through the shared actor-profile event");
  assert.match(facebookContainerSource, /facebook-comment-author/, "Facebook comment author names must expose a usable tap target");
  assert.match(facebookContainerSource, /FacebookInlineEntityText/, "curated Facebook story text must use the reusable inline-entity renderer");
  assert.match(facebookContainerSource, /FacebookInlineEntityText text=\{comment\.text\} mentions=\{comment\.mentions\}/, "structured curated comment mentions must reuse the Facebook inline-entity renderer");
  assert.match(facebookContainerSource, /SESSION_START_ISO[^\n]+elapsedMs/, "Facebook story metadata must derive simulated now from the existing global clock");
  assert.doesNotMatch(facebookStoryTimeSource, /Date\.now\(|new Date\(\s*\)/, "Facebook story metadata must never read real system time");
  assert.doesNotMatch(facebookStoryTimeSource, /Math\.max\(0,\s*simulatedNowMs\s*-\s*storyTimeMs\)/, "future timestamps must not be silently clamped to just now");
  assert.match(facebookStoryTimeSource, /Future story[^`]+story=/, "DEV future-time warning must identify the story and timestamps");
  assert.doesNotMatch(`${facebookStoryTimeSource}\n${facebookContainerSource}`, /setInterval|setTimeout/, "Facebook story metadata must not create a second timer");
  assert.match(facebookContainerSource, /facebook-inline-mention/, "structured Facebook mention tokens must expose a dedicated tap target");
  assert.match(facebookContainerSource, /OPEN_COMMENT_AUTHOR/, "inline mentions must reuse the existing Facebook actor/profile router");
  assert.doesNotMatch(facebookContainerSource, /match\([^)]*@|split\([^)]*@|@\[A-Za-z/, "Facebook mentions must not auto-link arbitrary @name text through naive parsing");
  assert.doesNotMatch(facebookContainerSource, /HomeDestination[^\n]+label="Groups"/, "Groups must not appear as an October 20 launcher destination");
  assert.match(facebookContainerSource, /facebook-home-empty-slot[^\n]+REJECTED-FOR-TARGET-DATE/, "the post-November Groups position must remain intentionally empty");
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
