import { useEffect, useState, type ComponentPropsWithoutRef } from "react";
import { resolveTwitterAvatar, TWITTER_DEFAULT_AVATAR } from "../data/twitterAvatarRegistry";

type TwitterAvatarProps = Omit<ComponentPropsWithoutRef<"span">, "children"> & {
  identityId?: string | null;
  displayName: string;
  allowNameBridge?: boolean;
};

export function TwitterAvatar({ identityId, displayName, allowNameBridge = true, className = "", ...spanProps }: TwitterAvatarProps) {
  const resolvedAvatar = resolveTwitterAvatar({ identityId, displayName, allowNameBridge });
  const [sourceFailed, setSourceFailed] = useState(false);
  useEffect(() => { setSourceFailed(false); }, [resolvedAvatar.mediaId]);
  const avatar = sourceFailed ? TWITTER_DEFAULT_AVATAR : resolvedAvatar;
  return <span
    {...spanProps}
    className={`twitter-avatar-fixture is-image${className ? ` ${className}` : ""}`}
    data-avatar-classification={avatar.classification}
    data-avatar-media-id={avatar.mediaId}
  >
    <img
      src={avatar.src}
      alt=""
      aria-hidden="true"
      style={{ objectPosition: avatar.objectPosition }}
      onError={avatar.mediaId === TWITTER_DEFAULT_AVATAR.mediaId ? undefined : () => setSourceFailed(true)}
    />
  </span>;
}
