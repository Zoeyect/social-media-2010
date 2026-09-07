/** One resource per active run. Also deduplicates React effect replay. */
export function createExperienceSessionResource<T>() {
  let current: { experienceSessionId: string; value: T } | null = null;
  return {
    get(experienceSessionId: string, create: () => T): T {
      if (current?.experienceSessionId !== experienceSessionId) current = { experienceSessionId, value: create() };
      return current.value;
    },
    clear() { current = null; },
    get experienceSessionId() { return current?.experienceSessionId ?? null; },
    get value() { return current?.value; },
  };
}
