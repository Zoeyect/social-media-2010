export const TWITTER_VERNACULAR_RULES = Object.freeze({
  classification: "VERNACULAR-CROSSCHECK" as const,
  commonStrongSlang: Object.freeze(["lol", "omg", "haha", "ahaha", "wtf", "lmao", "idk", "brb", "btw", "ttyl", "u", "ur", "ppl", "thx", "pls"]),
  periodSupportedSlang: Object.freeze(["fml", "epic fail"]),
  holdTerms: Object.freeze(["rn"]),
  rejectedModernDefaults: Object.freeze(["yolo", "stan", "mood", "lowkey", "highkey", "no cap", "slay"]),
  topicTags: Object.freeze(["bored", "tired", "work-frustration", "school-frustration", "bragging-light", "gossip", "reaction", "direct-reply", "link-share", "weather", "TV", "phone", "social-plan", "late-night"]),
  shortLinkHosts: Object.freeze([
    Object.freeze({ host: "bit.ly", status: "STRONG" as const }),
    Object.freeze({ host: "tinyurl.com", status: "STRONG" as const }),
    Object.freeze({ host: "twitpic.com", status: "PERIOD-SUPPORTED" as const }),
    Object.freeze({ host: "yfrog.com", status: "HOLD" as const }),
  ]),
  writingConstraints: Object.freeze({
    commonWordRange: Object.freeze([3, 15]),
    preferContextFragments: true,
    varyVoiceByIdentity: true,
    automaticRandomGeneration: false,
    finalFictionalContentClassification: "CURATED" as const,
  }),
});
