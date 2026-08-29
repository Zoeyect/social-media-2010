import { GELATO_ROMA_VENUE, MAIN_STREET_DINER_VENUE } from "./canonicalVenues";
import type { CanonicalVenueId } from "./canonicalVenues";
import type { FacebookStoryMediaId } from "./facebookStoryMedia";

export const FACEBOOK_PAGE_IDS = [
  "facebook-page-high-school-festival",
  "facebook-page-main-street-diner",
  "facebook-page-gelato-roma",
] as const;

export type FacebookPageId = typeof FACEBOOK_PAGE_IDS[number];
export type FacebookPageCategory = "School / Event" | "Local Business / Restaurant" | "Local Business / Food & Drink";

export type FacebookPageRecord = {
  id: FacebookPageId;
  name: string;
  category: FacebookPageCategory;
  avatarMediaId: FacebookStoryMediaId | null;
  venueId?: CanonicalVenueId;
  initialIsFan: boolean;
  posts: readonly never[];
  classification: "FACEBOOK_PAGE";
};

export const FACEBOOK_PAGES: readonly FacebookPageRecord[] = Object.freeze([
  Object.freeze({ id: "facebook-page-high-school-festival", name: "High School Festival", category: "School / Event", avatarMediaId: null, initialIsFan: false, posts: Object.freeze([]), classification: "FACEBOOK_PAGE" }),
  Object.freeze({ id: "facebook-page-main-street-diner", name: MAIN_STREET_DINER_VENUE.name, category: "Local Business / Restaurant", avatarMediaId: null, venueId: MAIN_STREET_DINER_VENUE.id, initialIsFan: false, posts: Object.freeze([]), classification: "FACEBOOK_PAGE" }),
  Object.freeze({ id: "facebook-page-gelato-roma", name: GELATO_ROMA_VENUE.name, category: "Local Business / Food & Drink", avatarMediaId: null, venueId: GELATO_ROMA_VENUE.id, initialIsFan: false, posts: Object.freeze([]), classification: "FACEBOOK_PAGE" }),
]);

export function getFacebookPage(pageId: FacebookPageId) {
  return FACEBOOK_PAGES.find(page => page.id === pageId) ?? null;
}
