import React from "react";

export const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: title in react
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
    <path d="M320-200v-560l440 280-440 280Z" fill="currentColor" />
  </svg>
);

export const PauseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: title in react
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
    <path
      d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z"
      fill="currentColor"
    />
  </svg>
);

export const EnterFullscreenIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: title in react
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
    <path
      d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z"
      fill="currentColor"
    />
  </svg>
);

export const ExitFullscreenIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: title in react
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
    <path
      fill="currentColor"
      d="M240-120v-120H120v-80h200v200h-80Zm400 0v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520 0v-200h80v120h120v80H640Z"
    />
  </svg>
);

export const PictureInPictureIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: title in react
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
    <path
      fill="currentColor"
      d="M80-520v-80h144L52-772l56-56 172 172v-144h80v280H80Zm80 360q-33 0-56.5-23.5T80-240v-200h80v200h320v80H160Zm640-280v-280H440v-80h360q33 0 56.5 23.5T880-720v280h-80ZM560-160v-200h320v200H560Z"
    />
  </svg>
);

export const LoadingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: title in react
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
    <path
      fill="currentColor"
      d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z"
    />
  </svg>
);

export const MuteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: title in react
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
    <path
      fill="currentColor"
      d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Z"
    />
  </svg>
);

export const UnmuteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: title in react
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
    <path
      fill="currentColor"
      d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320Z"
    />
  </svg>
);

export const ClipIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: title in react
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
    <path
      fill="currentColor"
      d="M760-120 480-400l-94 94q8 15 11 32t3 34q0 66-47 113T240-80q-66 0-113-47T80-240q0-66 47-113t113-47q17 0 34 3t32 11l94-94-94-94q-15 8-32 11t-34 3q-66 0-113-47T80-720q0-66 47-113t113-47q66 0 113 47t47 113q0 17-3 34t-11 32l494 494v40H760ZM600-520l-80-80 240-240h120v40L600-520ZM240-640q33 0 56.5-23.5T320-720q0-33-23.5-56.5T240-800q-33 0-56.5 23.5T160-720q0 33 23.5 56.5T240-640Zm240 180q8 0 14-6t6-14q0-8-6-14t-14-6q-8 0-14 6t-6 14q0 8 6 14t14 6ZM240-160q33 0 56.5-23.5T320-240q0-33-23.5-56.5T240-320q-33 0-56.5 23.5T160-240q0 33 23.5 56.5T240-160Z"
    />
  </svg>
);

export const OfflineErrorIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: title in react
  <svg
    viewBox="0 0 324 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M82 8.30584L239.745 5.68359L242.335 118.151L83.9414 118.502L82 8.30584Z"
      fill="#97F2EF"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M66 124.072L254.898 124L258 129L68.3248 128.971L66 124.072Z"
      fill="#97F2EF"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M94.2062 111.151L92.5204 15.5292L229.556 14.1187L231.803 111.716L94.2062 111.151Z"
      fill="#4CC38A"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M185 58.1481C185 70.8507 174.703 82 162 82C153.04 82 145.277 77.3008 141.48 70.0741C141.421 69.9609 141.362 69.8472 141.305 69.7328C140.965 69.0558 140.782 66.2859 140.704 64.963C140.278 66.2407 140.43 67.3765 140.507 67.9444C139.533 65.4642 139 62.7423 139 59.8519C139 47.1493 149.297 36 162 36C166.913 36 171.467 37.4132 175.204 39.8814C175.63 41.0012 176.226 43.6667 175.204 45.3704C176 44.8025 177.651 43.3259 177.888 41.963C182.27 45.9317 185 51.6082 185 58.1481Z"
      fill="#141716"
    />
    <path
      d="M140.704 64.963C140.278 66.2407 140.43 67.3765 140.507 67.9444C140.746 68.5556 141.013 69.1521 141.305 69.7328C140.965 69.0558 140.782 66.2859 140.704 64.963Z"
      fill="#141716"
    />
    <path
      d="M171 60.5003L156 70V60.6462V51L166.104 57.3994L171 60.5003Z"
      stroke="#4CC38A"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M101.096 100.921L176.5 101.109M219.885 101.163L198.193 101.136"
      stroke="#141716"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M148.197 101.161C148.197 103.28 146.472 104.998 144.344 104.998C142.215 104.998 140.49 103.28 140.49 101.161C140.49 99.042 142.215 97.3242 144.344 97.3242C146.472 97.3242 148.197 99.042 148.197 101.161Z"
      fill="#DF0087"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M148.197 101.161C148.197 103.28 146.472 104.998 144.344 104.998C142.215 104.998 140.49 103.28 140.49 101.161C140.49 99.042 142.215 97.3242 144.344 97.3242C146.472 97.3242 148.197 99.042 148.197 101.161Z"
      stroke="#141716"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M93.7252 111.754L91.7752 14.7408L230.275 13.7374L232.225 112.245L93.7252 111.754Z"
      stroke="#141716"
      strokeWidth="2.5"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M49.0868 58.0273L49.9632 88.7907L19.4093 88.9852L19.0201 58.6113L49.0868 58.0273ZM51 89.7922L50.0663 57L18 57.6228L18.4147 90L51 89.7922Z"
      fill="#434545"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M296.114 25.1881L297.132 60.7679L261.637 60.9929L261.185 25.8636L296.114 25.1881ZM298.336 61.9263L297.252 24L260 24.7203L260.482 62.1666L298.336 61.9263Z"
      fill="#434545"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M293.138 78.0001L293 67.2077L303.689 67.0001L304 77.9308L293.138 78.0001ZM304.309 78.2288L292.842 78.3019L292.696 66.9135L303.98 66.6943L304.309 78.2288ZM303.071 67.6482L293.644 67.8313L293.766 77.3599L303.346 77.2989L303.071 67.6482ZM303.362 67.3425L293.34 67.5372L293.47 77.6618L303.654 77.5969L303.362 67.3425Z"
      fill="#434545"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M303.362 67.3424L303.654 77.5969L293.47 77.6617L293.34 67.5371L303.362 67.3424ZM304 77.9307L303.689 67L293 67.2076L293.138 78L304 77.9307Z"
      fill="#434545"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M289.594 66.2179L289.78 72.7435L283.299 72.7847L283.216 66.3418L289.594 66.2179ZM290 72.9559L289.802 66L283 66.1321L283.088 73L290 72.9559Z"
      fill="#434545"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M290.309 73.254L282.792 73.3019L282.696 65.838L290.093 65.6943L290.309 73.254ZM289.594 66.218L289.78 72.7435L283.299 72.7848L283.216 66.3419L289.594 66.218ZM289.471 72.4455L283.595 72.4829L283.52 66.636L289.303 66.5237L289.471 72.4455ZM283.088 73.0001L283 66.1322L289.802 66.0001L290 72.956L283.088 73.0001Z"
      fill="#434545"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M47.442 36.3017L47.3038 47.0941L57.9925 47.3017L58.3038 36.371L47.442 36.3017ZM58.6124 36.0729L47.1459 35.9998L47 47.3883L58.284 47.6074L58.6124 36.0729ZM57.3747 46.6536L47.9476 46.4704L48.0697 36.9419L57.6496 37.0029L57.3747 46.6536ZM57.6661 46.9593L47.6438 46.7646L47.7736 36.64L57.9582 36.7048L57.6661 46.9593Z"
      fill="#434545"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M57.6661 46.9593L57.9582 36.7049L47.7736 36.64L47.6439 46.7646L57.6661 46.9593ZM58.3038 36.371L57.9926 47.3018L47.3038 47.0942L47.4421 36.3018L58.3038 36.371Z"
      fill="#434545"
    />
  </svg>
);

export const PrivateErrorIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: title in react
  <svg
    viewBox="0 0 324 142"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="162"
      cy="76"
      r="23"
      stroke="#141716"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M242 88.5C242 88.5 206.183 131 162 131C117.817 131 82 88.5 82 88.5C82 88.5 117.817 46 162 46C206.183 46 242 88.5 242 88.5Z"
      fill="#97F2EF"
    />
    <path
      d="M249 82C249 82 210.825 128 162.5 128C114.175 128 74.5 82.5 74.5 82.5C74.5 82.5 114.175 32 162.5 32C219 34 249 82 249 82Z"
      fill="#97F2EF"
    />
    <path
      d="M249 82.5C249 82.5 210.049 129 162 129C113.951 129 75 82.5 75 82.5C75 82.5 113.951 36 162 36C210.049 36 249 82.5 249 82.5Z"
      fill="#4CC38A"
    />
    <path
      d="M216.5 60.8302C202.013 51.0702 182.921 42 162 42C116.713 42 80 84.5 80 84.5C80 84.5 116.713 127 162 127C207.287 127 244 84.5 244 84.5C244 84.5 240.941 80.9589 235.5 75.921"
      stroke="#141716"
      strokeWidth="2.5"
    />
    <path
      d="M118 117.5C117 119.5 107.5 122.7 107.5 125.5M127 121.5C123.667 126.167 117 136.7 117 141.5"
      stroke="#97F2EF"
      strokeWidth="2.5"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M193 86C193 100.912 180.912 114 166 114C155.482 114 146.369 108.484 141.912 100C141.842 99.8672 141.773 99.7336 141.706 99.5994C141.306 98.8046 141.091 95.553 141 94C140.5 95.5 140.679 96.8333 140.769 97.5C139.626 94.5884 139 91.3932 139 88C139 73.0883 151.088 60 166 60C171.768 60 177.113 61.6589 181.5 64.5564C182 65.8709 182.7 69 181.5 71C182.434 70.3333 184.373 68.6 184.652 67C189.796 71.6589 193 78.3227 193 86Z"
      fill="#141716"
    />
    <path
      d="M141 94C140.5 95.5 140.679 96.8333 140.769 97.5C141.05 98.2174 141.363 98.9177 141.706 99.5994C141.306 98.8046 141.091 95.553 141 94Z"
      fill="#141716"
    />
    <path
      d="M170.403 79C176.754 79 182.328 84.8203 182.328 92C182.328 99.1797 177.606 105 171.254 105C167.788 105 164.552 103.266 162.328 100.523C161.871 99.9592 161.457 99.3526 161.092 98.7097C159.98 96.7509 159.328 94.4549 159.328 92C159.328 84.8203 164.051 79 170.403 79Z"
      fill="#4CC38A"
    />
    <path
      d="M70.5 43C77 48.1667 87.3 55 94.5 63M98 8C103 19.6667 113 44.8 113 52M156.5 0.5C156 12.5 158 32.5 158 32.5M223 56C231.667 50.6667 241 43 263 39"
      stroke="#97F2EF"
      strokeWidth="2.5"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M288.028 49.4047L287.706 29.9756L312.554 29.6019L313.278 49.28L288.028 49.4047ZM313.995 49.8165L287.339 49.9481L287 29.4461L313.232 29.0515L313.995 49.8165ZM311.118 30.7687L289.203 31.0984L289.487 48.2522L311.757 48.1424L311.118 30.7687ZM311.795 30.2184L288.497 30.5688L288.798 48.7957L312.474 48.679L311.795 30.2184Z"
      fill="#434545"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M311.795 30.2182L312.475 48.6788L288.798 48.7955L288.497 30.5687L311.795 30.2182ZM313.278 49.2798L312.554 29.6017L287.706 29.9755L288.028 49.4045L313.278 49.2798Z"
      fill="#434545"
    />
    <path
      d="M308.595 29.6018V24.201C308.595 20.224 305.371 17 301.394 17V17C297.417 17 294.193 20.224 294.193 24.201V29.6018"
      stroke="#434545"
      strokeWidth="2"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M31.9897 127.881L31.6802 109.168L55.6122 108.808L56.309 127.761L31.9897 127.881ZM57 128.278L31.3266 128.405L31 108.658L56.2646 108.278L57 128.278ZM54.2287 109.932L33.1217 110.25L33.3951 126.771L54.8443 126.665L54.2287 109.932ZM54.8812 109.402L32.4415 109.74L32.732 127.295L55.5352 127.182L54.8812 109.402Z"
      fill="#434545"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M54.8813 109.402L55.5353 127.182L32.7321 127.295L32.4416 109.74L54.8813 109.402ZM56.3091 127.761L55.6122 108.808L31.6803 109.168L31.9898 127.881L56.3091 127.761Z"
      fill="#434545"
    />
    <path
      d="M51.7984 108.808V103.606C51.7984 99.776 48.6932 96.6709 44.8628 96.6709V96.6709C41.0325 96.6709 37.9273 99.776 37.9273 103.606V108.808"
      stroke="#434545"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.4568 93.4225L16.3139 85.9741L27.3595 85.8309L27.6811 93.3747L16.4568 93.4225ZM28 93.5804L16.1507 93.6308L16 85.7711L27.6606 85.6199L28 93.5804ZM26.7209 86.2782L16.9793 86.4046L17.1054 92.9807L27.005 92.9386L26.7209 86.2782ZM27.0221 86.0672L16.6653 86.2016L16.7994 93.189L27.324 93.1443L27.0221 86.0672Z"
      fill="#434545"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M27.0221 86.0676L27.324 93.1447L16.7994 93.1895L16.6654 86.202L27.0221 86.0676ZM27.6811 93.3751L27.3595 85.8313L16.314 85.9746L16.4568 93.4229L27.6811 93.3751Z"
      fill="#434545"
    />
    <path
      d="M25.5992 85.831V84.201C25.5992 82.4331 24.1661 81 22.3982 81V81C20.6304 81 19.1972 82.4331 19.1972 84.201V85.831"
      stroke="#434545"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M289.419 69.8179L289.288 62.3096L299.413 62.1844L299.708 69.7762L289.419 69.8179ZM300 69.9559L289.138 70L289 62.1322L299.689 62L300 69.9559ZM299 63H290L290.013 69.4319L299.088 69.3951L299 63ZM299.104 62.3909L289.61 62.5083L289.733 69.6139L299.38 69.5748L299.104 62.3909Z"
      fill="#434545"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M299.104 62.3909L299.38 69.5748L289.733 69.6139L289.61 62.5083L299.104 62.3909ZM299.708 69.7762L299.413 62.1844L289.288 62.3096L289.419 69.8179L299.708 69.7762Z"
      fill="#434545"
    />
    <path
      d="M296.752 62.9402V61.2516C296.752 60.0081 295.744 59 294.5 59V59C293.257 59 292.249 60.0081 292.249 61.2516V62.9402"
      stroke="#434545"
    />
  </svg>
);

export const EnableVideoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: title in react
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
    <path
      fill="currentColor"
      d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h480q33 0 56.5 23.5T720-720v180l160-160v440L720-420v180q0 33-23.5 56.5T640-160H160Z"
    />
  </svg>
);

export const DisableVideoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: title in react
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
    <path
      fill="currentColor"
      d="M880-260 720-420v67L273-800h367q33 0 56.5 23.5T720-720v180l160-160v440ZM822-26 26-822l56-56L878-82l-56 56ZM160-800l560 560q0 33-23.5 56.5T640-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800Z"
    />
  </svg>
);

export const StopIcon = (props: React.SVGProps<SVGSVGElement>) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: title in react
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" {...props}>
    <path fill="currentColor" d="M240-240v-480h480v480H240Z" />
  </svg>
);
