import { describe, expect, it } from 'vitest';

import { parseCid } from './decentralizedStorage';

const ipfsPathGateways = [
  'https://w3s.link/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
] as const;

const ipfsSubdomainGateways = [
  `https://replace.ipfs.dweb.link`,
  `https://replace.ipfs.cf-ipfs.com`,
  `https://replace.ipfs.localhost:8080`,
] as const;

describe('parseCid', () => {
  it('handles an IPFS CID', async () => {
    const sourceCid =
      'bafybeiar26nqkdtiyrzbaxwcdm7zkr2o36xljqskdvg6z6ugwlmpkdhamy';

    const url = parseCid(sourceCid);

    expect(url?.url).toEqual(
      'ipfs://bafybeiar26nqkdtiyrzbaxwcdm7zkr2o36xljqskdvg6z6ugwlmpkdhamy',
    );
  });

  it('errors on paths in a CID', async () => {
    const sourceCid =
      'bafybeiar26nqkdtiyrzbaxwcdm7zkr2o36xljqskdvg6z6ugwlmpkdhamy/somepath.mp4';

    const url = parseCid(sourceCid);

    expect(url).toEqual(null);
  });

  it('errors on malformatted CID', async () => {
    const sourceCid =
      'UUfybeiar26nqkdtiyrzbaxwcdm7zkr2o36xljqskdvg6z6ugwlmpkdhamy';

    const url = parseCid(sourceCid);

    expect(url).toEqual(null);
  });

  it('handles a regular ipfs url', async () => {
    const sourceUrl =
      'ipfs://bafybeiar26nqkdtiyrzbaxwcdm7zkr2o36xljqskdvg6z6ugwlmpkdhamy';

    const url = parseCid(sourceUrl);

    expect(url?.url).toEqual(sourceUrl);
  });

  it('errors on paths in a regular ipfs url', async () => {
    const sourceUrl =
      'ipfs://bafybeiar26nqkdtiyrzbaxwcdm7zkr2o36xljqskdvg6z6ugwlmpkdhamy/somepath.mp4';

    const url = parseCid(sourceUrl);

    expect(url).toEqual(null);
  });

  it('errors on query params in a regular ipfs url', async () => {
    const sourceUrl =
      'ipfs://bafybeiar26nqkdtiyrzbaxwcdm7zkr2o36xljqskdvg6z6ugwlmpkdhamy?key=value';

    const url = parseCid(sourceUrl);

    expect(url).toEqual(null);
  });

  it('handles ipfs gateways', async () => {
    for (const gateway of ipfsPathGateways) {
      const url = parseCid(
        `${gateway}bafybeiar26nqkdtiyrzbaxwcdm7zkr2o36xljqskdvg6z6ugwlmpkdhamy`,
      );

      expect(url?.url).toEqual(
        'ipfs://bafybeiar26nqkdtiyrzbaxwcdm7zkr2o36xljqskdvg6z6ugwlmpkdhamy',
      );
    }
  });

  it('errors on malformatted CIDs in ipfs gateways', async () => {
    for (const gateway of ipfsPathGateways) {
      const url = parseCid(
        `${gateway}bafybeiar26nqkdtiUUzbaxwcdm7zkr2o36xljqskdvg6z6ugwlmpkdhamy`,
      );

      expect(url).toEqual(null);
    }
  });

  it('errors on paths in an ipfs gateway', async () => {
    for (const gateway of ipfsPathGateways) {
      const url = parseCid(
        `${gateway}bafybeiar26nqkdtiyrzbaxwcdm7zkr2o36xljqskdvg6z6ugwlmpkdhamy/somepath.mp4`,
      );

      expect(url).toEqual(null);
    }
  });

  it('handles subdomain gateways', async () => {
    for (const gateway of ipfsSubdomainGateways) {
      const url = parseCid(
        gateway.replace(
          'replace',
          'bafybeiar26nqkdtiyrzbaxwcdm7zkr2o36xljqskdvg6z6ugwlmpkdhamy',
        ),
      );

      expect(url?.url).toEqual(
        'ipfs://bafybeiar26nqkdtiyrzbaxwcdm7zkr2o36xljqskdvg6z6ugwlmpkdhamy',
      );
    }
  });

  it('errors on paths in a subdomain gateway', async () => {
    for (const gateway of ipfsSubdomainGateways) {
      const url = parseCid(
        `${gateway.replace(
          'replace',
          'bafybeiar26nqkdtiyrzbaxwcdm7zkr2o36xljqskdvg6z6ugwlmpkdhamy',
        )}/somepath.mp4`,
      );

      expect(url).toEqual(null);
    }
  });

  it('errors on query params in a subdomain gateway', async () => {
    for (const gateway of ipfsSubdomainGateways) {
      const url = parseCid(
        `${gateway.replace(
          'replace',
          'bafybeiar26nqkdtiyrzbaxwcdm7zkr2o36xljqskdvg6z6ugwlmpkdhamy',
        )}?key=value`,
      );

      expect(url).toEqual(null);
    }
  });
});
