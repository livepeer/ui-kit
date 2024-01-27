// Arweave Protocol
const arweaveProtocolPattern = /^(ar):\/\/([^/?#]+)(.*)$/;

// Gateways
const pathGatewayPattern =
  /^https:\/\/(arweave\.net|arweave\.dev)\/([^/?#]+)(.*)$/;
const subdomainGatewayPattern =
  /^https:\/\/([^/]+)\.(arweave\.net|arweave\.dev)\/([^/?#]+)(.*)$/;

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
  const arweaveProtocolUrlIndicators = possibleArweaveString.match(
    arweaveProtocolPattern,
  )?.[3];

  if (arweaveProtocolHash) {
    return formatReturnHash(arweaveProtocolHash, arweaveProtocolUrlIndicators);
  }

  const subdomainGatewayHash = possibleArweaveString.match(
    subdomainGatewayPattern,
  )?.[3];
  const subdomainGatewayUrlIndicators = possibleArweaveString.match(
    subdomainGatewayPattern,
  )?.[4];

  if (subdomainGatewayHash) {
    return formatReturnHash(
      subdomainGatewayHash,
      subdomainGatewayUrlIndicators,
    );
  }

  const pathGatewayHash = possibleArweaveString.match(pathGatewayPattern)?.[2];
  const pathGatewayUrlIndicators =
    possibleArweaveString.match(pathGatewayPattern)?.[3];

  if (pathGatewayHash) {
    return formatReturnHash(pathGatewayHash, pathGatewayUrlIndicators);
  }

  return null;
};

const formatReturnHash = (hash: string, urlIndicators?: string) => {
  const hashWithUrlIndicators = `${hash}${urlIndicators ?? ""}`;
  return {
    url: `ar://${hashWithUrlIndicators}`,
    id: hashWithUrlIndicators,
  };
};
