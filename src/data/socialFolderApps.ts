export type SocialAppIconStatus = "READY" | "HOLD";

type InstalledSocialAppState = {
  installed: true;
};

type InstagramLaunchState = InstalledSocialAppState & {
  photos: 0;
  followers: 0;
  following: 0;
};

export type SocialFolderApp = {
  id: "facebook" | "twitter" | "foursquare" | "tumblr" | "flickr" | "instagram";
  name: "Facebook" | "Twitter" | "Foursquare" | "Tumblr" | "Flickr" | "Instagram";
  iconStatus: SocialAppIconStatus;
  provenance: string;
  installState: InstalledSocialAppState | InstagramLaunchState;
  available: boolean;
  launchTarget: "social-app-runtime";
  iconSrc?: string;
};

export const SOCIAL_FOLDER_APPS: readonly SocialFolderApp[] = [
  {
    id: "facebook",
    name: "Facebook",
    iconStatus: "HOLD",
    provenance: "Facebook 3.1.4 is period-correct; original Retina icon payload not recovered.",
    installState: { installed: true },
    available: false,
    launchTarget: "social-app-runtime",
  },
  {
    id: "twitter",
    name: "Twitter",
    iconStatus: "HOLD",
    provenance: "First-party Twitter for iPhone is period-correct; October 2010 icon payload not recovered.",
    installState: { installed: true },
    available: false,
    launchTarget: "social-app-runtime",
  },
  {
    id: "foursquare",
    name: "Foursquare",
    iconStatus: "HOLD",
    provenance: "Foursquare 2.0 is period-correct; original icon payload not recovered.",
    installState: { installed: true },
    available: false,
    launchTarget: "social-app-runtime",
  },
  {
    id: "tumblr",
    name: "Tumblr",
    iconStatus: "HOLD",
    provenance: "Tumblr 1.2 is period-correct; original icon payload not recovered.",
    installState: { installed: true },
    available: false,
    launchTarget: "social-app-runtime",
  },
  {
    id: "flickr",
    name: "Flickr",
    iconStatus: "HOLD",
    provenance: "Flickr 1.2 is period-correct and non-Retina; original 57x57 icon payload not recovered.",
    installState: { installed: true },
    available: false,
    launchTarget: "social-app-runtime",
  },
  {
    id: "instagram",
    name: "Instagram",
    iconStatus: "HOLD",
    provenance: "Instagram 1.0 is period-correct after its 2010-10-06 launch; original launch icon payload not recovered.",
    installState: { installed: true, photos: 0, followers: 0, following: 0 },
    available: false,
    launchTarget: "social-app-runtime",
  },
] as const;

export const SOCIAL_FOLDER_SLOTS = [
  ...SOCIAL_FOLDER_APPS,
  ...Array.from({ length: 6 }, () => undefined),
] as const;
