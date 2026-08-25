import type { ImgHTMLAttributes, SyntheticEvent } from "react";

type HistoricalStatusAssetProps = ImgHTMLAttributes<HTMLImageElement>;

export function HistoricalStatusAsset({ onError, ...props }: HistoricalStatusAssetProps) {
  const hideUnavailableAsset = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.hidden = true;
    onError?.(event);
  };

  return <img {...props} onError={hideUnavailableAsset} />;
}
