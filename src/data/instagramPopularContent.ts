import download01 from "../assets/instagram/popular/download-1.jpg";
import download02 from "../assets/instagram/popular/download-2.jpg";
import download03 from "../assets/instagram/popular/download-3.jpg";
import download04 from "../assets/instagram/popular/download-4.jpg";
import download05 from "../assets/instagram/popular/download-5.jpg";
import download06 from "../assets/instagram/popular/download-6.jpg";
import download07 from "../assets/instagram/popular/download-7.jpg";
import download08 from "../assets/instagram/popular/download-8.jpg";
import download09 from "../assets/instagram/popular/download-9.jpg";
import download10 from "../assets/instagram/popular/download.jpg";
import generated01 from "../assets/instagram/popular/exec-1f6767a4-cf22-491d-8f3a-cf1fdc10e7fb.png";
import generated02 from "../assets/instagram/popular/exec-41a0d040-a5eb-498d-9355-33cd3084ef86.png";
import generated03 from "../assets/instagram/popular/exec-55f4e893-25ac-4a82-9d35-e78616ff30a9.png";
import generated04 from "../assets/instagram/popular/exec-97eaa794-ce3b-4035-b5e2-20ba6121620a.png";
import generated05 from "../assets/instagram/popular/exec-428db246-e5ab-4560-8e5d-5d3a6de8c944.png";
import generated06 from "../assets/instagram/popular/exec-2240f76c-4eb3-4886-abfa-4cf7c37b5e95.png";
import generated07 from "../assets/instagram/popular/exec-12928cc7-14ca-4a68-9bf8-1b837960fbfd.png";
import generated08 from "../assets/instagram/popular/exec-b77c5812-5b33-4a32-ab07-ea8f72bed573.png";
import generated09 from "../assets/instagram/popular/exec-c0a3e65d-9e6d-4e98-b39d-3518cdda745a.png";
import generated10 from "../assets/instagram/popular/exec-e0c2d2b7-7f9b-4272-9067-ddf366935553.png";

export const INSTAGRAM_POPULAR_POST_IDS = [
  "popular-magazine-01", "popular-street-01", "popular-street-02", "popular-food-01",
  "popular-landscape-01", "popular-coffee-01", "popular-pet-01", "popular-nightlife-01",
  "popular-portrait-01", "popular-pet-02", "popular-nightlife-02", "popular-landscape-02",
  "popular-coffee-02", "popular-coffee-03", "popular-object-01", "popular-object-02",
  "popular-landscape-03", "popular-object-03", "popular-technology-01", "popular-landscape-04",
] as const;

export type InstagramPopularPostId = typeof INSTAGRAM_POPULAR_POST_IDS[number];
export type InstagramPopularCategory = "magazine" | "street" | "food" | "landscape" | "coffee" | "pet" | "nightlife" | "portrait" | "object" | "technology";

export type InstagramPopularPost = Readonly<{
  id: InstagramPopularPostId;
  media: string;
  ephemeralUserId: string;
  username: string;
  relativeTimestamp: string;
  category: InstagramPopularCategory;
  classification: "EPHEMERAL_INSTAGRAM_USER";
  mediaStatus: "CURATED_LOCAL_ASSET";
}>;

const popularPost = (id: InstagramPopularPostId, media: string, ephemeralUserId: string, username: string, relativeTimestamp: string, category: InstagramPopularCategory): InstagramPopularPost => Object.freeze({
  id, media, ephemeralUserId, username, relativeTimestamp, category,
  classification: "EPHEMERAL_INSTAGRAM_USER",
  mediaStatus: "CURATED_LOCAL_ASSET",
});

// This explicit registry order is canonical. Runtime filesystem order and
// randomization never participate in Popular ranking.
export const INSTAGRAM_POPULAR_POSTS: readonly InstagramPopularPost[] = Object.freeze([
  popularPost("popular-magazine-01", download01, "ig-ephemeral-01", "papertrail", "2m", "magazine"),
  popularPost("popular-street-01", download02, "ig-ephemeral-02", "rearview", "3m", "street"),
  popularPost("popular-street-02", download03, "ig-ephemeral-03", "cityblocks", "4m", "street"),
  popularPost("popular-food-01", download04, "ig-ephemeral-04", "makiroll", "5m", "food"),
  popularPost("popular-landscape-01", download05, "ig-ephemeral-05", "aboveclouds", "6m", "landscape"),
  popularPost("popular-coffee-01", download06, "ig-ephemeral-06", "firstcup", "7m", "coffee"),
  popularPost("popular-pet-01", download07, "ig-ephemeral-07", "curlypup", "8m", "pet"),
  popularPost("popular-nightlife-01", download08, "ig-ephemeral-08", "afterhours", "9m", "nightlife"),
  popularPost("popular-portrait-01", download09, "ig-ephemeral-09", "mirrorlight", "10m", "portrait"),
  popularPost("popular-pet-02", download10, "ig-ephemeral-10", "windowcat", "11m", "pet"),
  popularPost("popular-nightlife-02", generated01, "ig-ephemeral-11", "nightcycle", "12m", "nightlife"),
  popularPost("popular-landscape-02", generated02, "ig-ephemeral-12", "poollights", "13m", "landscape"),
  popularPost("popular-coffee-02", generated03, "ig-ephemeral-13", "tablemaps", "14m", "coffee"),
  popularPost("popular-coffee-03", generated04, "ig-ephemeral-14", "cornerseat", "15m", "coffee"),
  popularPost("popular-object-01", generated05, "ig-ephemeral-15", "recordstack", "16m", "object"),
  popularPost("popular-object-02", generated06, "ig-ephemeral-16", "desklamp", "17m", "object"),
  popularPost("popular-landscape-03", generated07, "ig-ephemeral-17", "trailhead", "18m", "landscape"),
  popularPost("popular-object-03", generated08, "ig-ephemeral-18", "sixstrings", "19m", "object"),
  popularPost("popular-technology-01", generated09, "ig-ephemeral-19", "latework", "20m", "technology"),
  popularPost("popular-landscape-04", generated10, "ig-ephemeral-20", "rooftopview", "21m", "landscape"),
]);

export function getInstagramPopularPost(postId: InstagramPopularPostId): InstagramPopularPost {
  return INSTAGRAM_POPULAR_POSTS.find(post => post.id === postId)!;
}
