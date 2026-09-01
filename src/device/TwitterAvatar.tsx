import type { ComponentPropsWithoutRef } from "react";
import { resolveTwitterAvatar } from "../data/twitterAvatarRegistry";

type TwitterAvatarProps = Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  identityId?: string | null;
  displayName: string;
  fallbackText: string;
  allowNameBridge?: boolean;
};

export function TwitterAvatar({ identityId, displayName, fallbackText, allowNameBridge = true, className = "", ...spanProps }: TwitterAvatarProps) {
  const avatar = resolveTwitterAvatar({ identityId, displayName, allowNameBridge });
  return <span
    {...spanProps}
    className={`twitter-avatar-fixture${avatar ? " is-image" : ""}${className ? ` ${className}` : ""}`}
    data-avatar-classification={avatar?.classification}
    data-avatar-media-id={avatar?.mediaId}
  >
    {avatar
      ? <img src={avatar.src} alt="" aria-hidden="true" style={{ objectPosition: avatar.objectPosition }} />
      : fallbackText}
  </span>;
}
