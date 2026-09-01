import { PUBLIC_TWITTER_MOCK_DTOS } from "./publicTwitterFixtures";
import {
  mapApprovedPublicTwitterPostDtos,
  type PublicTwitterListOptions,
  type PublicTwitterMappingDiagnostic,
  type PublicTwitterRepository,
} from "./publicTwitterRepository";

export function createMockPublicTwitterRepository(
  diagnostic?: PublicTwitterMappingDiagnostic,
): PublicTwitterRepository {
  return Object.freeze({
    async listApprovedPosts(options: PublicTwitterListOptions = {}) {
      const posts = mapApprovedPublicTwitterPostDtos(PUBLIC_TWITTER_MOCK_DTOS, diagnostic);
      if (options.limit === undefined) return posts;
      const limit = Number.isFinite(options.limit) ? Math.max(0, Math.floor(options.limit)) : 0;
      return Object.freeze(posts.slice(0, limit));
    },
  });
}
