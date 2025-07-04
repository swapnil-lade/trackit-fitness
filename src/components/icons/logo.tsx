import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="120"
      height="32"
      viewBox="0 0 120 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Trackit Logo"
      {...props}
    >
      <path
        d="M6.20177 25.625H10.0118L14.5018 15.055L19.0418 25.625H22.7718L16.6418 11.455L17.0118 10.715H12.0418L12.4718 11.455L6.20177 25.625Z"
        className="fill-primary"
      />
      <path
        d="M29.175 23.375C28.055 24.785 26.575 25.755 24.735 26.285C22.895 26.815 20.915 26.845 19.015 26.365C17.115 25.885 15.415 24.925 14.155 23.575C12.895 22.225 12.135 20.545 11.975 18.735C11.815 16.925 12.265 15.115 13.265 13.545C14.265 11.975 15.765 10.735 17.565 9.99502C19.365 9.25502 21.375 9.06502 23.295 9.45502C24.225 9.65502 25.105 10.005 25.905 10.495L24.875 13.225C24.015 12.805 23.125 12.525 22.215 12.405C20.765 12.205 19.325 12.485 18.095 13.205C16.865 13.925 15.925 14.995 15.455 16.295C14.985 17.595 15.025 19.005 15.565 20.265C16.105 21.525 17.115 22.545 18.405 23.135C19.695 23.725 21.175 23.855 22.565 23.505C23.955 23.155 25.175 22.345 26.015 21.215L29.175 23.375Z"
        className="fill-primary"
      />
      <text
        x="35"
        y="24"
        fontFamily="Poppins, sans-serif"
        fontSize="20"
        fontWeight="bold"
        className="fill-foreground"
      >
        Trackit
      </text>
    </svg>
  );
}
