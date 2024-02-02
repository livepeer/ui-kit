import { describe, expect, it } from "vitest";

import { parseArweaveTxId } from "./arweave";

const arweavePathGateways = [
  "https://arweave.net/",
  "https://arweave.dev/",
] as const;

const arweaveSubdomainGateways = [
  "https://wxkn73wsvzl2yebxd77lwmjmkuawf4r5bjbm7k2t7eqigmctzlna.arweave.net/replace",
  "https://wxkn73wsvzl2yebxd77lwmjmkuawf4r5bjbm7k2t7eqigmctzlna.arweave.dev/replace",
] as const;

describe("parseArweaveTxId", () => {
  it("handles an Arweave protocol URL", async () => {
    const source = "ar://tdTf7tKuV6wQNx_-uzEsVQFi8j0KQs-rU_kggzBTyto";

    const url = parseArweaveTxId(source);

    expect(url?.url).toEqual(
      "ar://tdTf7tKuV6wQNx_-uzEsVQFi8j0KQs-rU_kggzBTyto",
    );
  });

  it("errors on regular playback ID", async () => {
    const source = "6d7el73r1y12chxr";

    const url = parseArweaveTxId(source);

    expect(url).toEqual(null);
  });

  it("handles paths in a regular Arweave url", async () => {
    const sourceUrl =
      "ar://tdTf7tKuV6wQNx_-uzEsVQFi8j0KQs-rU_kggzBTyto/somepath.mp4";

    const url = parseArweaveTxId(sourceUrl);

    expect(url?.url).toEqual(sourceUrl);
  });

  it("handles query params in a regular Arweave url", async () => {
    const sourceUrl =
      "ar://tdTf7tKuV6wQNx_-uzEsVQFi8j0KQs-rU_kggzBTyto?key=value";

    const url = parseArweaveTxId(sourceUrl);

    expect(url?.url).toEqual(sourceUrl);
  });

  it("handles Arweave gateways", async () => {
    for (const gateway of arweavePathGateways) {
      const url = parseArweaveTxId(
        `${gateway}tdTf7tKuV6wQNx_-uzEsVQFi8j0KQs-rU_kggzBTyto`,
      );

      expect(url?.url).toEqual(
        "ar://tdTf7tKuV6wQNx_-uzEsVQFi8j0KQs-rU_kggzBTyto",
      );
    }
  });

  it("handles paths in an Arweave gateway", async () => {
    for (const gateway of arweavePathGateways) {
      const url = parseArweaveTxId(
        `${gateway}tdTf7tKuV6wQNx_-uzEsVQFi8j0KQs-rU_kggzBTyto/somepath.mp4`,
      );

      expect(url?.url).toEqual(
        "ar://tdTf7tKuV6wQNx_-uzEsVQFi8j0KQs-rU_kggzBTyto/somepath.mp4",
      );
    }
  });

  it("handles subdomain gateways", async () => {
    for (const gateway of arweaveSubdomainGateways) {
      const url = parseArweaveTxId(
        gateway.replace(
          "replace",
          "tdTf7tKuV6wQNx_-uzEsVQFi8j0KQs-rU_kggzBTyto",
        ),
      );

      expect(url?.url).toEqual(
        "ar://tdTf7tKuV6wQNx_-uzEsVQFi8j0KQs-rU_kggzBTyto",
      );
    }
  });

  it("handles paths in a subdomain gateway", async () => {
    for (const gateway of arweaveSubdomainGateways) {
      const url = parseArweaveTxId(
        `${gateway.replace(
          "replace",
          "tdTf7tKuV6wQNx_-uzEsVQFi8j0KQs-rU_kggzBTyto",
        )}/somepath.mp4`,
      );

      expect(url?.url).toEqual(
        "ar://tdTf7tKuV6wQNx_-uzEsVQFi8j0KQs-rU_kggzBTyto/somepath.mp4",
      );
    }
  });

  it("handles query params in a subdomain gateway", async () => {
    for (const gateway of arweaveSubdomainGateways) {
      const url = parseArweaveTxId(
        `${gateway.replace(
          "replace",
          "tdTf7tKuV6wQNx_-uzEsVQFi8j0KQs-rU_kggzBTyto",
        )}?key=value`,
      );

      expect(url?.url).toEqual(
        "ar://tdTf7tKuV6wQNx_-uzEsVQFi8j0KQs-rU_kggzBTyto?key=value",
      );
    }
  });
});
