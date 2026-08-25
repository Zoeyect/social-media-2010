# Twitter Mentions / Home Timeline Routing v0.6.7

## Result

Mentions now indexes shared public Tweet entities instead of carrying a second copy of Tweet text. Home Timeline visibility is a separate routing decision, while unread/read remains Mentions-view metadata.

## Shared record model

- `mentionTweets` owns the Alex and Chris Tweet entities.
- each `mentions` record contains `tweetId`, unread state, provenance, and the historical Home eligibility decision;
- Mentions resolves its displayed author, text, timestamp, and linked status from the Tweet entity;
- Home Timeline activity selection references the same Tweet object when eligible;
- Favorite, Reply, and Retweet continue to key off that shared Tweet ID.

No Mention Tweet is cloned into `timeline`. The selector composes Timeline activities from the ordinary Timeline collection plus eligible shared Mention Tweet references.

## 2010 routing policy

Both seed records begin with the current session handle and are @reply-style Tweets, so both always appear in Mentions.

- Alex is part of the designed baseline follow graph. Alex's Tweet is marked Home-eligible at seed/session construction and appears in both Mentions and Home Timeline.
- Chris is initially unfollowed. Chris's Tweet appears only in Mentions.

Following Chris later does not retroactively insert this already-created historical Tweet. A future Tweet-delivery model may evaluate the shared graph at delivery time, but v0.6.7 does not rewrite past routing.

Alex and Chris are registered as fictional ordinary profiles. They are not Suggested/public accounts and do not receive v0.6.5 live follower drift.

## Read and interaction independence

Opening Alex changes only the corresponding Mention index from unread to read. The Tweet remains in Home Timeline. Therefore the Mentions blue indicator can disappear without changing Timeline visibility.

Favorite/Retweet state is shared across Mentions, Timeline, and Detail because every surface uses `tweet-mention-alex-conan`. Reply targeting also resolves the shared entity.

The Alex Tweet retains a plain functional link to the older authentic Conan status. Opening that link from Mentions returns to Mentions; opening it from Home Timeline returns to Timeline. No modern embedded share card was introduced.

## Functional checks

- Alex and Chris both exist in Mentions.
- baseline follow graph contains Alex and excludes Chris.
- Timeline activity contains the exact Alex Tweet object reference.
- Timeline activity contains no Chris Tweet.
- reading Alex clears unread without removing the Timeline item.
- Favorite and Retweet both store the shared Alex Tweet ID.
- Mention count/blue-dot state remains derived independently.
- no scheduler definition or event was changed.

## Validation

- `npm run test:seed`: PASS
- `npm run build`: PASS
- `git diff --check`: PASS
- System Foundation, scheduler, Cross-App Timeline, Messages.app, sibling apps, battery, and lock routing were not modified.
