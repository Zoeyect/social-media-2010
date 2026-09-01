import type { PublicTwitterSubmissionDraft, PublicTwitterSubmissionRepository, PublicTwitterSubmissionResult } from "./publicTwitterSubmissionRepository";

export type MockPublicTwitterSubmissionRepository = PublicTwitterSubmissionRepository & Readonly<{
  failNextSubmission(): void;
}>;

function payloadKey(draft: PublicTwitterSubmissionDraft): string {
  return JSON.stringify(draft);
}

function stableSubmissionId(key: string): string {
  let hash = 2166136261;
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `mock-public-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function createMockPublicTwitterSubmissionRepository(): MockPublicTwitterSubmissionRepository {
  const results = new Map<string, { payload: string; result: PublicTwitterSubmissionResult }>();
  let failNext = false;
  return {
    failNextSubmission() { failNext = true; },
    async submit(draft) {
      const payload = payloadKey(draft);
      const existing = results.get(draft.idempotencyKey);
      if (existing) {
        if (existing.payload !== payload) throw new Error("Idempotency key reused with conflicting public submission payload");
        return existing.result;
      }
      if (failNext) {
        failNext = false;
        throw new Error("Mock public submission failed");
      }
      const result = Object.freeze({ status: "accepted_for_publication" as const, submissionId: stableSubmissionId(draft.idempotencyKey) });
      results.set(draft.idempotencyKey, { payload, result });
      return result;
    },
  };
}
