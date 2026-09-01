import type { PublicVisitorTweet } from "../data/publicTwitterRepository";
import type { TwitterTimelineActivity, TwitterTweet } from "./twitterState";

export type TwitterTimelineViewModel = TwitterTimelineActivity & Readonly<{
  source: "canonical" | "public_visitor";
  capabilities: Readonly<{ detail: boolean; profile: boolean; reply: boolean; retweet: boolean; favorite: boolean }>;
}>;

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function selectPublicVisitorPostIds(posts: readonly PublicVisitorTweet[], experienceSessionId: string, maximum = 3): readonly string[] {
  return Object.freeze([...posts]
    .sort((left, right) => stableHash(`${experienceSessionId}:${left.id}`) - stableHash(`${experienceSessionId}:${right.id}`) || left.id.localeCompare(right.id))
    .slice(0, Math.max(0, maximum))
    .map(post => post.id));
}

const CANONICAL_CAPABILITIES = Object.freeze({ detail: true, profile: true, reply: true, retweet: true, favorite: true });
const PUBLIC_CAPABILITIES = Object.freeze({ detail: false, profile: false, reply: false, retweet: false, favorite: true });

export function composeTwitterTimelineActivities(
  canonical: readonly TwitterTimelineActivity[],
  approvedPosts: readonly PublicVisitorTweet[],
  selectedArchiveIds: readonly string[],
): readonly TwitterTimelineViewModel[] {
  const selected = selectedArchiveIds.flatMap(id => {
    const post = approvedPosts.find(candidate => candidate.id === id);
    if (!post) return [];
    const timestamp = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles" }).format(new Date(post.simulated2010CreatedAt));
    const tweet: TwitterTweet = {
      id: post.id, displayName: post.displayName ?? `@${post.publicHandle}`, authorHandle: `@${post.publicHandle}`,
      text: post.body, timestamp, createdAt: Date.parse(post.simulated2010CreatedAt), type: "tweet",
      contentStatus: "HOLD-fictional", origin: "live",
    };
    return [{ id: post.id, tweet, retweetActivity: false, effectiveAt: tweet.createdAt!, source: "public_visitor" as const, capabilities: PUBLIC_CAPABILITIES }];
  });
  const output: TwitterTimelineViewModel[] = [];
  canonical.forEach((activity, index) => {
    output.push({ ...activity, source: "canonical", capabilities: { ...CANONICAL_CAPABILITIES, retweet: activity.tweet.origin !== "user" } });
    if ((index + 1) % 4 === 0 && selected.length) output.push(selected.shift()!);
  });
  return output;
}
