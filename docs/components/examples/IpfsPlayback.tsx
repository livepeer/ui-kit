import { Box, Text, TextField } from '@livepeer/design-system';
import { Player } from '@livepeer/react';
import { parseCid } from 'livepeer/media';

import { useMemo, useState } from 'react';

export const IpfsPlayback = () => {
  const [ipfsUrl, setIpfsUrl] = useState<string>('');

  const ipfsParsed = useMemo(() => parseCid(ipfsUrl), [ipfsUrl]);

  return (
    <Box css={{ my: '$6' }}>
      <Box
        css={{
          mb: '$3',
          width: '100%',
        }}
      >
        <Text css={{ my: '$1' }} variant="gray">
          IPFS URL
        </Text>
        <TextField
          size="3"
          type="text"
          placeholder="https://cloudflare-ipfs.com/ipfs/..."
          onChange={(e) => setIpfsUrl(e.target.value)}
        />

        {ipfsUrl && !ipfsParsed && (
          <Text css={{ my: '$1' }} variant="red">
            Provided value is not a valid CID.
          </Text>
        )}
      </Box>

      {ipfsParsed && (
        <Box css={{ mt: '$2' }}>
          <Player title={ipfsParsed.cid} src={ipfsUrl} autoPlay muted />
        </Box>
      )}
    </Box>
  );
};
