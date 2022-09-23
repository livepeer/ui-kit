import { Player } from '@livepeer/react';
import * as React from 'react';

const playbackId =
  'bafybeigtqixg4ywcem3p6sitz55wy6xvnr565s6kuwhznpwjices3mmxoe';

export function HeaderVideo() {
  return <Player autoPlay loop muted playbackId={playbackId} />;
}
