import facebookIconSrc from "../assets/historical/ios4.1/springboard/apps/third-party/Facebook-2010-reference@2x.png";
import flickrIconSrc from "../assets/historical/ios4.1/springboard/apps/third-party/Flickr-2010-reference.png";
import foursquareIconSrc from "../assets/historical/ios4.1/springboard/apps/third-party/Foursquare-2010-reference@2x.png";
import instagramIconSrc from "../assets/historical/ios4.1/springboard/apps/third-party/Instagram-2010-reference@2x.png";
import tumblrIconSrc from "../assets/historical/ios4.1/springboard/apps/third-party/Tumblr-2010-reference@2x.png";
import twitterIconSrc from "../assets/historical/ios4.1/springboard/apps/third-party/Twitter-2010-reference@2x.png";

export type SocialAppIconStatus = "READY" | "HOLD";
export type SocialAppArtworkStatus = "RECONSTRUCTED_FROM_PERIOD_REFERENCE";

type InstalledSocialAppState = {
  installed: true;
};

type InstagramLaunchState = InstalledSocialAppState & {
  photos: 0;
  followers: 0;
  following: 0;
};

export type SpringBoardSocialApp = {
  id: "facebook" | "twitter" | "foursquare" | "tumblr" | "flickr" | "instagram";
  name: "Facebook" | "Twitter" | "Foursquare" | "Tumblr" | "Flickr" | "Instagram";
  iconStatus: SocialAppIconStatus;
  artworkStatus: SocialAppArtworkStatus;
  provenance: string;
  referenceUrl: string;
  assetPixelSize: 57 | 114;
  installState: InstalledSocialAppState | InstagramLaunchState;
  available: boolean;
  launchTarget: "social-app-runtime";
  iconSrc: string;
};

export const SPRINGBOARD_SOCIAL_APPS: readonly SpringBoardSocialApp[] = [
  {
    id: "facebook",
    name: "Facebook",
    iconStatus: "HOLD",
    artworkStatus: "RECONSTRUCTED_FROM_PERIOD_REFERENCE",
    provenance: "Reference-derived standalone raster; the original Facebook 3.1.4 Retina icon payload remains unrecovered.",
    referenceUrl: "https://www.webdesignmuseum.org/iphone/facebook-for-iphone-in-2010",
    assetPixelSize: 114,
    iconSrc: facebookIconSrc,
    installState: { installed: true },
    available: true,
    launchTarget: "social-app-runtime",
  },
  {
    id: "twitter",
    name: "Twitter",
    iconStatus: "HOLD",
    artworkStatus: "RECONSTRUCTED_FROM_PERIOD_REFERENCE",
    provenance: "Reference-derived standalone raster of the period Twitter bird; the October 2010 bundle payload remains unrecovered.",
    referenceUrl: "https://www.webdesignmuseum.org/iphone/twitter-for-iphone-in-2010",
    assetPixelSize: 114,
    iconSrc: twitterIconSrc,
    installState: { installed: true },
    available: true,
    launchTarget: "social-app-runtime",
  },
  {
    id: "foursquare",
    name: "Foursquare",
    iconStatus: "HOLD",
    artworkStatus: "RECONSTRUCTED_FROM_PERIOD_REFERENCE",
    provenance: "Reference-derived standalone raster of the Foursquare 2.0-era check-in mark; original bundle artwork remains unrecovered.",
    referenceUrl: "https://www.webdesignmuseum.org/iphone/foursquare-for-iphone-in-2010",
    assetPixelSize: 114,
    iconSrc: foursquareIconSrc,
    installState: { installed: true },
    available: true,
    launchTarget: "social-app-runtime",
  },
  {
    id: "tumblr",
    name: "Tumblr",
    iconStatus: "HOLD",
    artworkStatus: "RECONSTRUCTED_FROM_PERIOD_REFERENCE",
    provenance: "Reference-derived standalone raster of the Tumblr 1.2-era metallic icon; original bundle artwork remains unrecovered.",
    referenceUrl: "https://www.webdesignmuseum.org/iphone/tumblr-for-iphone-in-2010",
    assetPixelSize: 114,
    iconSrc: tumblrIconSrc,
    installState: { installed: true },
    available: true,
    launchTarget: "social-app-runtime",
  },
  {
    id: "flickr",
    name: "Flickr",
    iconStatus: "HOLD",
    artworkStatus: "RECONSTRUCTED_FROM_PERIOD_REFERENCE",
    provenance: "Reference-derived 57x57 standalone raster, preserving Flickr 1.2's documented lack of Retina artwork; original payload remains unrecovered.",
    referenceUrl: "https://www.webdesignmuseum.org/iphone/flickr-for-iphone-in-2010",
    assetPixelSize: 57,
    iconSrc: flickrIconSrc,
    installState: { installed: true },
    available: true,
    launchTarget: "social-app-runtime",
  },
  {
    id: "instagram",
    name: "Instagram",
    iconStatus: "HOLD",
    artworkStatus: "RECONSTRUCTED_FROM_PERIOD_REFERENCE",
    provenance: "Reference-derived standalone raster of the Instagram 1.0 camera; original launch bundle payload remains unrecovered.",
    referenceUrl: "https://www.webdesignmuseum.org/iphone/instagram-for-iphone-in-2010",
    assetPixelSize: 114,
    iconSrc: instagramIconSrc,
    installState: { installed: true, photos: 0, followers: 0, following: 0 },
    available: true,
    launchTarget: "social-app-runtime",
  },
] as const;
