import { describe, expect, it } from "vitest";

import {
  b64Decode,
  b64Encode,
  b64UrlDecode,
  b64UrlEncode,
  getFormattedHoursMinutesSeconds,
} from "./string";

describe("b64", () => {
  describe("default", () => {
    describe("encodes", () => {
      it("correctly encodes a precomputed value", () => {
        expect(b64Encode("somevalue")).toMatchInlineSnapshot('"c29tZXZhbHVl"');
      });
    });

    describe("decodes", () => {
      it("correctly decodes a precomputed value", () => {
        expect(b64Decode("c29tZXZhbHVl")).toMatchInlineSnapshot('"somevalue"');
      });

      it("returns null on invalid value", () => {
        expect(b64Decode("------")).toEqual(null);
      });

      it("returns null on invalid value", () => {
        expect(b64Decode("\\\\\\")).toEqual(null);
      });
    });
  });

  describe("url", () => {
    describe("encodes", () => {
      it("correctly encodes a precomputed value", () => {
        expect(b64UrlEncode("somevalue")).toMatchInlineSnapshot(
          '"c29tZXZhbHVl"',
        );
      });
    });

    describe("decodes", () => {
      it("correctly decodes a precomputed value", () => {
        expect(b64UrlDecode("c29tZXZhbHVl")).toMatchInlineSnapshot(
          '"somevalue"',
        );
      });

      it("returns null on invalid value", () => {
        expect(b64UrlDecode("\\\\\\")).toEqual(null);
      });
    });
  });
});

describe("utils", () => {
  describe("getFormattedHoursMinutesSeconds()", () => {
    it("formats a value under a minute", () => {
      const formatted = getFormattedHoursMinutesSeconds(22);

      expect(formatted).toMatchInlineSnapshot('"0:22"');
    });

    it("formats a value over a minute", () => {
      const formatted = getFormattedHoursMinutesSeconds(66);

      expect(formatted).toMatchInlineSnapshot('"1:06"');
    });

    it("formats a value over 10 minutes", () => {
      const formatted = getFormattedHoursMinutesSeconds(660);

      expect(formatted).toMatchInlineSnapshot('"11:00"');
    });

    it("formats a value over one hour", () => {
      const formatted = getFormattedHoursMinutesSeconds(3601);

      expect(formatted).toMatchInlineSnapshot('"1:00:01"');
    });

    it("formats a value over 7 hours", () => {
      const formatted = getFormattedHoursMinutesSeconds(25201);

      expect(formatted).toMatchInlineSnapshot('"7:00:01"');
    });

    it("formats a value = 7 hours and 1 minute", () => {
      const formatted = getFormattedHoursMinutesSeconds(25260);

      expect(formatted).toMatchInlineSnapshot('"7:01:00"');
    });

    it("formats a value = 7 hours and 1 minute and 5 sec", () => {
      const formatted = getFormattedHoursMinutesSeconds(25265);

      expect(formatted).toMatchInlineSnapshot('"7:01:05"');
    });

    it("formats a null value", () => {
      const formatted = getFormattedHoursMinutesSeconds(null);

      expect(formatted).toMatchInlineSnapshot('"0:00"');
    });

    it("formats a NaN value", () => {
      const formatted = getFormattedHoursMinutesSeconds(NaN);

      expect(formatted).toMatchInlineSnapshot('"0:00"');
    });

    it("formats an undefined value", () => {
      const formatted = getFormattedHoursMinutesSeconds(undefined);

      expect(formatted).toMatchInlineSnapshot('"0:00"');
    });
  });
});
