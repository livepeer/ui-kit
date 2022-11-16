import { CID } from 'multiformats/cid';

// IPFS CID (naive check for lack of URL indicators)
const ipfsCidPattern = /^([^/?#]+)$/;

// IPFS Protocol
const ipfsProtocolPattern = /^(ipfs):\/\/([^/?#]+)(.*)$/;

// Gateways
const pathGatewayPattern = /^https?:\/\/[^/]+\/(ipfs)\/([^/?#]+)(.*)$/;
const subdomainGatewayPattern = /^https?:\/\/([^/]+)\.(ipfs)\.[^/?#]+(.*)$/;

/**
 * Takes an IPFS CID or URL and returns a formatted IPFS URL if the CID/URL is valid.
 * _This does not allow paths, query params, or hash in the URL and will return null_.
 *
 * @param possibleIpfsString A possible URL for an IPFS resource. Can be a gateway or IPFS protocol URL.
 * @returns The formatted IPFS URI with protocol and CID. Returns null if the URL is not valid.
 */
export const parseCid = (possibleIpfsString: string | null | undefined) => {
  if (!possibleIpfsString) {
    return null;
  }

  const ipfsProtocolCid = possibleIpfsString.match(ipfsProtocolPattern)?.[2];
  const ipfsProtocolUrlIndicators =
    possibleIpfsString.match(ipfsProtocolPattern)?.[3];

  if (isCid(ipfsProtocolCid)) {
    return formatReturnCid(ipfsProtocolCid, ipfsProtocolUrlIndicators);
  }

  const subdomainGatewayCid = possibleIpfsString.match(
    subdomainGatewayPattern,
  )?.[1];
  const subdomainGatewayUrlIndicators = possibleIpfsString.match(
    subdomainGatewayPattern,
  )?.[3];

  if (isCid(subdomainGatewayCid)) {
    return formatReturnCid(subdomainGatewayCid, subdomainGatewayUrlIndicators);
  }

  const pathGatewayCid = possibleIpfsString.match(pathGatewayPattern)?.[2];
  const pathGatewayUrlIndicators =
    possibleIpfsString.match(pathGatewayPattern)?.[3];

  if (isCid(pathGatewayCid)) {
    return formatReturnCid(pathGatewayCid, pathGatewayUrlIndicators);
  }

  const ipfsCid = possibleIpfsString.match(ipfsCidPattern)?.[1];

  if (isCid(ipfsCid)) {
    return formatReturnCid(ipfsCid);
  }

  return null;
};

const isCid = (
  hash: CID | Uint8Array | string | undefined | null,
): hash is CID => {
  try {
    if (!hash) {
      return false;
    }

    if (typeof hash === 'string') {
      return Boolean(CID.parse(hash));
    }

    if (hash instanceof Uint8Array) {
      return Boolean(CID.decode(hash));
    }

    return Boolean(CID.asCID(hash));
  } catch {
    return false;
  }
};

const formatReturnCid = (cid: string, urlIndicators?: string) => {
  const cidWithUrlIndicators = `${cid}${urlIndicators ?? ''}`;
  return {
    url: `ipfs://${cidWithUrlIndicators}`,
    id: cidWithUrlIndicators,
  };
};
