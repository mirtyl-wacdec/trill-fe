export const AUDIO_REGEX = new RegExp(/https:\/\/.+\.(mp3|wav|ogg)\b/gim);
export const VIDEO_REGEX = new RegExp(/https:\/\/.+\.(mov|mp4|ogv)\b/gim);
export const TWITTER_REGEX = new RegExp(
  /https:\/\/twitter\.com\/.+\/status\/\d+/gim
);
export const REF_REGEX = new RegExp(/web\+urbitgraph:\/\/group\/\S+/gim);
export const IMAGE_REGEX = new RegExp(
  /https:\/\/.+\.(jpg|img|png|gif|tiff|jpeg|webp|webm|svg)\b/gim
);