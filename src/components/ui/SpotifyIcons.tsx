import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const HomeIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    aria-hidden="true"
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" />
  </svg>
);

export const HomeFilledIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    aria-hidden="true"
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M13.5 20.885v-7.004a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v7.004H3.5V8.534l8.5-4.908 8.5 4.908v12.351H13.5zM12 2.034a3 3 0 0 0-3 0l-7.5 4.33a2 2 0 0 0-1 1.732V22a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1v-7.004h2V22a1 1 0 0 0 1 1H22a1 1 0 0 0 1-1V8.096a2 2 0 0 0-1-1.732L15 3.034a3 3 0 0 0-3-1z" />
  </svg>
);

export const SearchIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    aria-hidden="true"
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M10.533 1.277c-5.18 0-9.407 4.228-9.407 9.407 0 5.18 4.227 9.407 9.407 9.407 2.091 0 4.02-.686 5.587-1.84l4.585 4.585a1 1 0 1 0 1.415-1.415l-4.585-4.585a9.375 9.375 0 0 0 2.413-6.152c0-5.18-4.228-9.407-9.407-9.407zm-7.407 9.407a7.407 7.407 0 1 1 14.814 0 7.407 7.407 0 0 1-14.814 0z" />
  </svg>
);

export const LibraryIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    aria-hidden="true"
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m16 6 4 14" />
    <path d="M12 6v14" />
    <path d="M8 8v12" />
    <path d="M4 4v16" />
  </svg>
);

export const LibraryFilledIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    aria-hidden="true"
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM12.085 4.1l8.915 13.924a1 1 0 0 1-.845 1.541h-17a1 1 0 0 1-.845-1.541L11.239 4.1a.5.5 0 0 1 .846 0z" />
  </svg>
);

export const PlusIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    viewBox="0 0 16 16"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z" />
  </svg>
);

export const ArrowRightIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    viewBox="0 0 16 16"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M11.25 8a.75.75 0 0 1-.22.53l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.44 8 5.72 4.28a.75.75 0 0 1 1.06-1.06l4.25 4.25c.14.14.22.33.22.53z" />
  </svg>
);

export const PlayIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M7.05 3.606l13.49 7.79a1.36 1.36 0 0 1 0 2.358l-13.49 7.79a1.36 1.36 0 0 1-2.05-1.179V4.785a1.36 1.36 0 0 1 2.05-1.179z" />
  </svg>
);

export const PauseIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M5.7 3a1.7 1.7 0 0 0-1.7 1.7v14.6a1.7 1.7 0 0 0 1.7 1.7h3.6a1.7 1.7 0 0 0 1.7-1.7V4.7a1.7 1.7 0 0 0-1.7-1.7H5.7zm9 0a1.7 1.7 0 0 0-1.7 1.7v14.6a1.7 1.7 0 0 0 1.7 1.7h3.6a1.7 1.7 0 0 0 1.7-1.7V4.7a1.7 1.7 0 0 0-1.7-1.7h-3.6z" />
  </svg>
);

export const PreviousIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    viewBox="0 0 16 16"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M3.3 1a.7.7 0 0 1 .7.7v5.4l8.3-5.3A1.2 1.2 0 0 1 14 2.8v10.4a1.2 1.2 0 0 1-1.7 1l-8.3-5.3v5.4a.7.7 0 0 1-1.4 0V1.7a.7.7 0 0 1 .7-.7z" />
  </svg>
);

export const NextIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    viewBox="0 0 16 16"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M12.7 1a.7.7 0 0 0-.7.7v5.4L3.7 1.8a1.2 1.2 0 0 0-1.7 1v10.4a1.2 1.2 0 0 0 1.7 1l8.3-5.3v5.4a.7.7 0 0 0 1.4 0V1.7a.7.7 0 0 0-.7-.7z" />
  </svg>
);

export const ShuffleIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    viewBox="0 0 16 16"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M13.12 2.06L16 4.94l-2.88 2.88-.7-.7 1.68-1.68c-2.35-.06-4.54.83-6.22 2.53L5.3 5.4c2.03-2.05 4.67-3.12 7.15-3.1l-1.63-1.62.7-.7zM1.44 2.06c2.48-.02 5.12 1.05 7.15 3.1l2.58 2.57c1.68 1.7 3.87 2.59 6.22 2.53l-1.68-1.68.7-.7L16 10.76l-2.88 2.88-.7-.7 1.63-1.62c-2.48-.02-5.12-1.05-7.15-3.1L5.3 7.64c-1.68-1.7-3.87-2.59-6.22-2.53v1h-1v-2l1-.05zM1.44 10.76v1h-1v-2l1-.05c2.35-.06 4.54.83 6.22 2.53L5.3 14.8c-2.03-2.05-4.67-3.12-7.15-3.1l1.63 1.62-.7.7L1.44 10.76z" />
  </svg>
);

export const RepeatIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    viewBox="0 0 16 16"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H5.06l1.62 1.62-.7.7L3.1 12.94l2.88-2.88.7.7-1.62 1.62h7.19A2.25 2.25 0 0 0 14.5 10.15v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 5.15v3.1h-1.5v-3.5zm4 3.5v-1h8v1H4z" />
  </svg>
);

export const VolumeHighIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    viewBox="0 0 16 16"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M9.74 1.15a.75.75 0 0 1 .26.55v12.6a.75.75 0 0 1-1.28.53L4.47 10.5H1.5A1.5 1.5 0 0 1 0 9V7a1.5 1.5 0 0 1 1.5-1.5h2.97l4.25-4.33a.75.75 0 0 1 1.02.02zm3.32 2.37a5.5 5.5 0 0 1 0 8.96l-.75-.76a4.5 4.5 0 0 0 0-7.44l.75-.76zm1.96-1.95a8.25 8.25 0 0 1 0 12.86l-.75-.76a7.25 7.25 0 0 0 0-11.34l.75-.76zM8.5 2.58L4.85 6.3a.75.75 0 0 1-.53.2H1.5A.5.5 0 0 0 1 7v2a.5.5 0 0 0 .5.5h2.82a.75.75 0 0 1 .53.2l3.65 3.72V2.58z" />
  </svg>
);

export const VolumeMediumIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    viewBox="0 0 16 16"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M9.74 1.15a.75.75 0 0 1 .26.55v12.6a.75.75 0 0 1-1.28.53L4.47 10.5H1.5A1.5 1.5 0 0 1 0 9V7a1.5 1.5 0 0 1 1.5-1.5h2.97l4.25-4.33a.75.75 0 0 1 1.02.02zm3.32 2.37a5.5 5.5 0 0 1 0 8.96l-.75-.76a4.5 4.5 0 0 0 0-7.44l.75-.76zM8.5 2.58L4.85 6.3a.75.75 0 0 1-.53.2H1.5A.5.5 0 0 0 1 7v2a.5.5 0 0 0 .5.5h2.82a.75.75 0 0 1 .53.2l3.65 3.72V2.58z" />
  </svg>
);

export const VolumeLowIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    viewBox="0 0 16 16"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M9.74 1.15a.75.75 0 0 1 .26.55v12.6a.75.75 0 0 1-1.28.53L4.47 10.5H1.5A1.5 1.5 0 0 1 0 9V7a1.5 1.5 0 0 1 1.5-1.5h2.97l4.25-4.33a.75.75 0 0 1 1.02.02zM8.5 2.58L4.85 6.3a.75.75 0 0 1-.53.2H1.5A.5.5 0 0 0 1 7v2a.5.5 0 0 0 .5.5h2.82a.75.75 0 0 1 .53.2l3.65 3.72V2.58z" />
  </svg>
);

export const VolumeMutedIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    viewBox="0 0 16 16"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M13.86 5.47a.75.75 0 0 0-1.06 1.06L14.34 8l-1.54 1.47a.75.75 0 1 0 1.06 1.06L15.4 9.06l1.47 1.47a.75.75 0 0 0 1.06-1.06L16.46 8l1.54-1.47a.75.75 0 0 0-1.06-1.06L15.4 6.94l-1.54-1.47zM9.74 1.15a.75.75 0 0 1 .26.55v12.6a.75.75 0 0 1-1.28.53L4.47 10.5H1.5A1.5 1.5 0 0 1 0 9V7a1.5 1.5 0 0 1 1.5-1.5h2.97l4.25-4.33a.75.75 0 0 1 1.02.02zm-1.24 1.43v10.84L4.85 9.7a.75.75 0 0 1-.53-.2H1.5A.5.5 0 0 0 1 9V7a.5.5 0 0 0 .5-.5h2.82a.75.75 0 0 1 .53-.2L8.5 2.58z" />
  </svg>
);

export const SpeakerIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    viewBox="0 0 16 16"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M12 15a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8zm1-11v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2zM5.5 7A1.5 1.5 0 1 0 7 5.5 1.5 1.5 0 0 0 5.5 7zM5.5 12a1.5 1.5 0 1 0 1.5-1.5A1.5 1.5 0 0 0 5.5 12zM10.5 7a1.5 1.5 0 1 0 1.5-1.5A1.5 1.5 0 0 0 10.5 7zM10.5 12a1.5 1.5 0 1 0 1.5-1.5A1.5 1.5 0 0 0 10.5 12z" />
  </svg>
);

export const QueueIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    viewBox="0 0 16 16"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M15 15H1v-1.5h14V15zm0-4.5H1V9h14v1.5zm0-4.5H1V4.5h14V6zm0-4.5H1V0h14v1.5z" />
  </svg>
);

export const LyricsIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    viewBox="0 0 16 16"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M12 1H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3zm1.5 11a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 12V4A1.5 1.5 0 0 1 4 2.5h8A1.5 1.5 0 0 1 13.5 4v8zM5 5.5h6v1H5v-1zm0 3.5h6v1H5V9z" />
  </svg>
);

export const PipIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    viewBox="0 0 16 16"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M0 3.75A2.75 2.75 0 0 1 2.75 1h10.5A2.75 2.75 0 0 1 16 3.75v8.5A2.75 2.75 0 0 1 13.25 15H2.75A2.75 2.75 0 0 1 0 12.25v-8.5zm1.5 0v8.5c0 .69.56 1.25 1.25 1.25H9.5V8.5h5V3.75c0-.69-.56-1.25-1.25-1.25H2.75c-.69 0-1.25.56-1.25 1.25zm9.5 6.25v2.5h3.75a1.25 1.25 0 0 0 1.25-1.25V10H11z" />
  </svg>
);

export const FullscreenIcon = ({ size = 16, className, ...props }: IconProps) => (
  <svg
    role="img"
    height={size}
    width={size}
    viewBox="0 0 16 16"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M6.5 1.5H1.5v5h1.5V3.06l4.28 4.28 1.06-1.06L4.06 3H6.5V1.5zm8 0H9.5V3h2.44L7.66 7.28l1.06 1.06L13 4.06v2.44h1.5V1.5zm-13 8H3v2.44l4.28-4.28 1.06 1.06-4.28 4.28H6.5v1.5H1.5v-5zm13 0H13v2.44l-4.28-4.28-1.06 1.06 4.28 4.28H9.5v1.5h5v-5z" />
  </svg>
);
