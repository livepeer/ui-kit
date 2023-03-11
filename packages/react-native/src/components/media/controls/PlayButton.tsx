import { MediaControllerState, omit } from "@livepeer/core-react";
import {
  PlayButtonProps,
  usePlayButton,
} from "@livepeer/core-react/components";
import * as React from "react";
import { Image } from "react-native";

import { Path } from "react-native-svg";

import { useMediaController } from "../../../context";
import { IconButton } from "../../styling";
import { ColoredSvg } from "../../styling/button";
import { MediaElement } from "../types";

const DefaultPlayIcon = () => (
  <Image
    source={{
      uri:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADv0lEQVR4nO2aS2sUQRCAW8U3ioKvgxKRYNK9STxE/AWiCIoiBLNTtQZzCF5CxIvHeNV4MChK3KosREEMeNH4uouo6FWTKB58ID4PCmo0JlK7GxPc5/T07CySgoKFZav726qprqoepWblP5XGc95KTbjPMPQYghuGcVgzftaEY2nNfH6a+Q56dL+3d0uqbYWqBqnt7VxoCEEz3jGE44Zx0pcSjmuGWybpeWJLVVrWD7YsNgRHDeMb35svCAWv6xmO1KTaFlUEQrO3SxM8dwbwj2qGZ7H+xM6Qwwh6wwLIVRgQzzuFaEi2rjWMjyoHgRnvED5sGsA1TiDqUm0bxd2VhjDTCWFU9hAIopYPrZY0GhkET3kGnptU2zorCMkeUYSTKRJmVinaMJyPevPmXxiGM75TbNSbNgU0RrCj/DTLMBL1hk1hrzwr69DMntj+FiD8ZhjimvBlRWAIukp7g+C1Dch06YLHDMOXcL2Cr4o++FIAWhkn+D7TTuMFWK8ZLhnCifCAIF4QJF3F2hn9kc9eAyW2asa7oYAQ3CjYT1iV4pkcP1bw35lUczQlElYhy0XD61ftRVie6410U2RrFH6qEtLc17FEnh/N+NUVTIy93flATgX5d0qBTK/j1RjCK46en5M5C2TbU8t4xfFyQf6ul4xvMwz3goUXXMsDgqP2RuG3spHu7rmaoF0TvLVcezjHpmb8FMAjEyqANA3gUs1wXNK4v3XhfS4I4VgQNysH0sjeJs1wNVDarwaQhlS8Pj1VCQQSJLQEZFLNsQXInGHQK9kvcGgFrXjVYMs83wSDLfM0JQ4bxg82a2rCp27TrwWIpF/N+MB9+mXoCWK0ua9jfjkAsf4DGwzDZScHIsEJpyVKOSBmsGWB9BEuS/xYvhJFBsq2RaNosf4glkzsNwwvXAGYbH2Xt2jMeAVuuwSpI6gzhDddAphpHSrs/qTn2RqeOd60TqdcvtYTtrpvdadAurvn1jMe1ATvwgIw2VZXnjlVTGS0bzumMYSPwwQwU0rQqUqJjFoinfVySR0ue+Io9xNVsOHJXE/ghObEduVHNMHZyDfOOXpa+RVxnwyOq8cbcL/kA15INvfFV1XLtUJDsnWtCiJyyRKsDQ6qMCIDC+VC5PorkjAjuC+XTSqUy9BQx6A4M5z6Qr17zx58YYbasO8UayuZjAZd6VLBmQfwpZzYkbwBkb0Uikt3aVMgZn8zJAWgdWp1LdIbxJK4R8aYmvB69gWaj1Mv1aQ/MzyR9lQ6O2mK6qh9mfONzIqqDvkDLUuYla4WH+AAAAAASUVORK5CYII=",
    }}
    style={{
      width: 36,
      height: 36,
      resizeMode: "contain",
    }}
  />
);

const DefaultPauseIcon = () => (
  <Image
    source={{
      uri:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACvElEQVR4nO2aT2sTURDA9+Sfg1JBrQehHoLtm1T7JUQRFL0Ukp0pQe+l4rfQeLAoSslMA/XWo7ao36CIZ5umPWm9iHq2WlqZ3UShm910N5u83dCBgYVNHvNjZufNvHmOcyRDKldeuGcM010QrALjKgg1jNBPw7Tjqf+87r/Dqll070zVKyNOFqQwP3scmNAIvQemXRDaj6VMu0bwLdRcV9dyBi0Xl6dPAuNDEPoa2/hQKNyeEHwwVq+cGAiEEfemYdxKDeCAGsHN4uLMjT6HEc73CyCouKSeTxVislYaBaGPg4Mg3ztMH64u0flUIMbrlUvq7kFDwP+E0FQbeoIoyL1zmkatQUjbM7gF9cqFRBCaPWyEE0SEWaIUDYIvbRsPB2EEn8VOsbaNhhAtMl4/fJoV3LBtMIR7ZfNQm2Zrx7ZuMETBMM519wbjtm1DoatX6Evkh68FYJKFO66Vwm8hUrEcCuJVsXkBYVwN7ScSleKWQIzQn8IrPB30htcUJYtZKx4R2i+Ke6sTyJO8gYDQ4+BifnuaKxAj+LoDCDXzBgJCjcBiRuhH7kAYvwVBmHZyByL4a4hBZEhCC3qoeG2BGKb1IU6/gtW8gQDjo+EtUabqlZF8FY34u2PR6HsF3+UFBIRWOkJ4C9ZcNy8gE0yloWh1YXn6mBMlerRv21DopoyzkRD/vJKBY1IIhaDmoU8cdT6RUYg9IzPXnDhiGJ9bN1wC+jQWRDvE9OA4O97Ata4feJhcXiifzcpYYbJWGnV6ER2y9NIG9664Ydgdc9IQHX9ZCTPGNR02OX0ZhjLtDSicFvo6e9f5RJ9DrRE7xSYVP6PhnFcqpOYB+qw7tpUbEK2hUFm7Sz2LjW28/58VLQATp9a0RXuDYo1u6zGmYXrTukDzvX2pxnsW/KTtqXZ22hSN8/1TqRtyJE425C+FaK4TGuopxAAAAABJRU5ErkJggg==",
    }}
    style={{
      width: 36,
      height: 36,
      resizeMode: "contain",
    }}
  />
);

const mediaControllerSelector = ({
  togglePlay,
  playing,
}: MediaControllerState<MediaElement>) => ({
  togglePlay,
  playing,
});

export type { PlayButtonProps };

export const PlayButton: React.FC<PlayButtonProps> = (props) => {
  const { togglePlay, playing } = useMediaController(mediaControllerSelector);

  const { buttonProps, title } = usePlayButton({
    togglePlay,
    playing,
    defaultPauseIcon: <DefaultPauseIcon />,
    defaultPlayIcon: <DefaultPlayIcon />,
    ...props,
  });

  return (
    <IconButton
      style={{
        width: props.size,
        height: props.size,
      }}
      size={{
        "@lg": "large",
      }}
      {...omit(buttonProps, "size")}
      accessibilityLabel={title}
    />
  );
};
