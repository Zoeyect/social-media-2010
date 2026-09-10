import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const server = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
try {
  const fb = await server.ssrLoadModule("/src/state/facebookState.ts");
  const tw = await server.ssrLoadModule("/src/state/twitterState.ts");
  const sms = await server.ssrLoadModule("/src/state/messagesState.ts");
  const { FacebookContainer } = await server.ssrLoadModule("/src/device/FacebookContainer.tsx");
  const { TwitterContainer } = await server.ssrLoadModule("/src/device/TwitterContainer.tsx");
  const { MobileSMSContainer } = await server.ssrLoadModule("/src/device/MobileSMSContainer.tsx");
  const { SessionIdentityContext } = await server.ssrLoadModule("/src/state/sessionIdentity.ts");
  const { IOS4KeyboardSystem } = await server.ssrLoadModule("/src/device/IOS4KeyboardSystem.tsx");
  const { initialPublicTwitterState } = await server.ssrLoadModule("/src/state/publicTwitterState.ts");
  const { SESSION_START_ISO } = await server.ssrLoadModule("/src/state/deviceMachine.ts");
  const elapsedMs = 123000, createdAt = Date.parse(SESSION_START_ISO) + elapsedMs;
  const image = Object.freeze({ id: "selected-camera-roll-photo", objectUrl: "blob:selected-camera-roll-photo", filename: "IMG_0001.JPG" });
  const noop = () => {};
  const common = { dispatch: noop, mediaAttachmentActive: false, onRequestMedia: noop, currentDeviceTime: "12:04 AM", currentDeviceDateTime: new Date(createdAt), elapsedMs, currentElapsedMs: elapsedMs };
  const render = (component, state, props = {}) => renderToStaticMarkup(createElement(SessionIdentityContext.Provider, { value: { name: "Visitor" } }, createElement(IOS4KeyboardSystem, { suspended: false }, createElement(component, { ...common, state, ...props }))));
  const facebook = (text, attached) => {
    let state = fb.createInitialFacebookState("Visitor");
    for (const event of [{ type: "SHOW_FEED" }, { type: "OPEN_STATUS_COMPOSER" }, { type: "EDIT_STATUS", value: text }, ...(attached ? [{ type: "MEDIA_RETURN", attachment: image }] : [])]) state = fb.facebookStateTransition(state, event);
    return state;
  };
  const twitter = (text, attached) => {
    let state = tw.createInitialTwitterState("Visitor");
    for (const event of [{ type: "BEGIN_NEW_TWEET" }, { type: "EDIT_COMPOSER", value: text }, ...(attached ? [{ type: "MEDIA_RETURN", contextId: "new", attachment: image }] : [])]) state = tw.twitterStateTransition(state, event);
    return state;
  };
  const fbSend = { type: "SUBMIT_STATUS", displayName: "Visitor", timestamp: common.currentDeviceTime, createdAt: new Date(createdAt).toISOString() };
  for (const [body, attached] of [["text only", false], ["", true], ["caption", true]]) {
    const before = facebook(body, attached);
    const html = render(FacebookContainer, before);
    assert.match(html, /<button type="submit">Share<\/button>/);
    assert.doesNotMatch(html, /posting unavailable|>Cancel<\/button>/i);
    const after = fb.facebookStateTransition(before, fbSend);
    assert.equal(after.feed.length, before.feed.length + 1);
    assert.equal(fb.facebookStateTransition(after, fbSend), after, "repeat Share is ignored after publication");
    const post = after.feed[0];
    assert.equal(post.text, body); assert.equal(post.author, "Visitor");
    assert.equal(post.createdAt, fbSend.createdAt); assert.equal(post.timestamp, fbSend.timestamp);
    assert.equal(post.attachment, attached ? image : undefined);
    assert.equal(after.statusDraft, ""); assert.equal(after.pendingAttachment, null);
    assert.equal(after.currentView, "feed"); assert.equal(after.statusComposerOpen, false);
    if (attached) assert.match(render(FacebookContainer, after), /data-media-id="selected-camera-roll-photo"/);
  }
  const fbDraft = facebook("keep this", true);
  assert.equal(fb.facebookStateTransition(fbDraft, { type: "REMOVE_ATTACHMENT" }).statusDraft, "keep this");
  const photoFirst = fb.facebookStateTransition(facebook("", true), fbSend);
  let another = fb.facebookStateTransition(photoFirst, { type: "OPEN_STATUS_COMPOSER" });
  another = fb.facebookStateTransition(another, { type: "EDIT_STATUS", value: "second" });
  another = fb.facebookStateTransition(another, fbSend);
  assert.equal(new Set(another.feed.map(post => post.id)).size, another.feed.length, "mixed photo/status posts keep unique IDs");
  const twProps = { publicState: initialPublicTwitterState, dispatchPublic: noop, onLocalTweetSubmitted: noop };
  const twSend = { type: "SUBMIT_NEW_TWEET", displayName: "Visitor", timestamp: common.currentDeviceTime, createdAt };
  for (const attached of [false, true]) {
    const before = twitter("x".repeat(140), attached);
    const html = render(TwitterContainer, before, twProps);
    assert.match(html, /class="twitter-send-button">Send/);
    assert.match(html, />Close<\/button>/); assert.doesNotMatch(html, /posting unavailable|>Cancel<\/button>/i);
    const after = tw.twitterStateTransition(before, twSend);
    assert.equal(after.timeline.length, before.timeline.length + 1);
    assert.equal(tw.twitterStateTransition(after, twSend), after);
    const post = after.timeline.find(post => post.origin === "user");
    assert.equal(post.text.length, 140); assert.equal(post.displayName, "Visitor");
    assert.equal(post.createdAt, createdAt); assert.equal(post.timestamp, twSend.timestamp);
    assert.equal(post.attachment, attached ? image : undefined);
    assert.equal(after.newTweetDraft, ""); assert.equal(after.pendingAttachment, null); assert.equal(after.currentView, "timeline");
    if (attached) {
      assert.match(render(TwitterContainer, after, twProps), /data-media-id="selected-camera-roll-photo"/);
      const detail = tw.twitterStateTransition(after, { type: "OPEN_TWEET", tweetId: post.id, scrollPosition: 0 });
      assert.match(render(TwitterContainer, detail, twProps), /data-media-id="selected-camera-roll-photo"/);
    }
    const over = { ...before, newTweetDraft: "x".repeat(141) };
    assert.equal(tw.twitterStateTransition(over, twSend), over);
  }
  const empty = twitter("", true);
  assert.equal(tw.twitterStateTransition(empty, twSend), empty, "Twitter retains its required-text rule");
  assert.match(render(TwitterContainer, empty, twProps), /twitter-send-button" disabled/);
  const draft = twitter("retain caption", true);
  assert.equal(tw.twitterStateTransition(draft, { type: "REMOVE_ATTACHMENT" }).newTweetDraft, "retain caption");
  const closed = tw.twitterStateTransition(draft, { type: "CANCEL_REPLY" });
  assert.equal(closed.currentView, "timeline"); assert.equal(closed.newTweetDraft, ""); assert.equal(closed.pendingAttachment, null);
  let messages = sms.createInitialMessagesState();
  messages = sms.messagesStateTransition(messages, { type: "RECEIVE_MESSAGE", id: "incoming", conversationId: "mom", sender: "Mom", message: "Hello" });
  messages = sms.messagesStateTransition(messages, { type: "OPEN_CONVERSATION", conversationId: "mom" });
  const smsProps = { cameraPickerActive: false, onOpenCameraPicker: noop, onScheduleMomReply: noop, onScheduleMomLoveReply: noop, onScheduleDadLoveReply: noop };
  const incomingBefore = render(MobileSMSContainer, messages, smsProps).match(/<p class="mobilesms-bubble is-incoming"[^>]*>.*?<\/p>/)[0];
  messages = sms.messagesStateTransition(messages, { type: "MEDIA_RETURN", contextId: "mom", attachment: image });
  messages = sms.messagesStateTransition(messages, { type: "SEND", elapsedMs, timestamp: common.currentDeviceTime, createdAt: new Date(createdAt).toISOString() });
  const sent = messages.messages.at(-1);
  assert.equal(sent.attachment, image); assert.equal(sent.sender, "Me"); assert.equal(sent.conversationId, "mom"); assert.equal(sent.createdAt, fbSend.createdAt);
  const html = render(MobileSMSContainer, messages, smsProps);
  assert.match(html, /mobilesms-message-row is-outgoing"><p class="mobilesms-bubble is-outgoing is-mms"/);
  assert.ok(html.includes(incomingBefore));
  messages = sms.messagesStateTransition(messages, { type: "EDIT_DRAFT", value: "plain SMS" });
  messages = sms.messagesStateTransition(messages, { type: "SEND", elapsedMs });
  assert.equal(messages.messages.at(-1).text, "plain SMS"); assert.equal(messages.messages.at(-1).attachment, undefined);
  assert.match(render(MobileSMSContainer, messages, smsProps), /class="mobilesms-bubble is-outgoing"[^>]*>plain SMS/);
  for (const [transition, state] of [[fb.facebookStateTransition, fbDraft], [tw.twitterStateTransition, draft]]) assert.equal(transition(state, { type: "RESET", displayName: "Next" }).pendingAttachment, null);
  const css = await readFile(new URL("../styles/device.css", import.meta.url), "utf8");
  assert.match(css, /\.mobilesms-image-message \{[^}]*width: auto; height: auto;[^}]*object-fit: contain/);
  assert.match(css, /\.mobilesms-message-row\.is-outgoing \{[^}]*justify-content: flex-end/);
  assert.match(css, /\.mobilesms-bubble\.is-outgoing\.is-mms \{[^}]*padding: 3px/);
  assert.match(css, /\.mobilesms-bubble\.is-outgoing\.is-mms::after/);
  console.log("PASS media publishing: Facebook text/photo, Twitter text+photo/140/Close, one-record references/timestamps/reset, MMS render/SMS parity");
} finally { await server.close(); }
