import type { InstagramFilter } from "../../state/instagramState";

export const INSTAGRAM_FILTER_OPTIONS = [
  { id: "Original", label: "Normal" },
  { id: "X-Pro II", label: "X-Pro II" },
  { id: "Lomo-fi", label: "Lomo-fi" },
  { id: "Earlybird", label: "Earlybird" },
  { id: "1977", label: "1977" },
] as const satisfies readonly { id: InstagramFilter; label: string }[];

type InstagramFilteredImageProps = {
  src: string;
  alt: string;
  filter: InstagramFilter;
};

export function InstagramFilteredImage({ src, alt, filter }: InstagramFilteredImageProps) {
  return <span
    className="instagram-filtered-image"
    data-instagram-filter={filter}
    data-processing-status="RECONSTRUCTED"
  >
    <img src={src} alt={alt} />
    <span className="instagram-filtered-image-wash" aria-hidden="true" />
    <span className="instagram-filtered-image-vignette" aria-hidden="true" />
  </span>;
}

export function instagramVisibleFilterLabel(filter: InstagramFilter | null): string {
  return INSTAGRAM_FILTER_OPTIONS.find(option => option.id === filter)?.label ?? "";
}
