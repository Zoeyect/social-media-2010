export type PublicTwitterSubmissionDraft = Readonly<{
  publicHandle: string;
  body: string;
  simulated2010CreatedAt: string;
  simulatedElapsedMs: number;
  idempotencyKey: string;
}>;

export type PublicTwitterSubmissionResult = Readonly<{
  status: "accepted_for_publication";
  submissionId: string;
}>;

export interface PublicTwitterSubmissionRepository {
  submit(draft: PublicTwitterSubmissionDraft): Promise<PublicTwitterSubmissionResult>;
  withdraw(submissionId: string): Promise<Readonly<{ status: "withdrawn" }>>;
}
