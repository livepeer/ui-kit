// Arweave Protocol
const arweaveProtocolPattern = /^(ar):\/\/([^/?#]+)$/;

// Gateways
const pathGatewayPattern = /^https:\/\/(arweave\.net|arweave\.dev)\/([^/?#]+)$/;
const subdomainGatewayPattern =
  /^https:\/\/([^/]+)\.(arweave\.net|arweave\.dev)\/([^/?#]+)$/;

/**
 * Takes an Arweave URL and returns a formatted Arweave URL if it is valid.
 * _This does not allow paths, query params, or hash in the URL and will return null_.
 * It does not check if the hash is a correct base64 URL encoded SHA-256 hash
 *
 * @param possibleArweaveString A possible URL for an Arweave resource. Can be a gateway or Arweave protocol URL.
 * @returns The formatted Arweave URI with `ar://` protocol and hash. Returns null if the URL is not valid.
 */
export const parseArweaveTxId = (
  possibleArweaveString: string | null | undefined,
) => {
  if (!possibleArweaveString) {
    return null;
  }

  const arweaveProtocolHash = possibleArweaveString.match(
    arweaveProtocolPattern,
  )?.[2];

  if (arweaveProtocolHash) {
    return formatReturnHash(arweaveProtocolHash);
  }

  const subdomainGatewayHash = possibleArweaveString.match(
    subdomainGatewayPattern,
  )?.[3];

  if (subdomainGatewayHash) {
    return formatReturnHash(subdomainGatewayHash);
  }

  const pathGatewayHash = possibleArweaveString.match(pathGatewayPattern)?.[2];

  if (pathGatewayHash) {
    return formatReturnHash(pathGatewayHash);
  }

  return null;
};

const formatReturnHash = (hash: string) => {
  return {
    url: `ar://${hash}`,
    id: hash,
  };
};
