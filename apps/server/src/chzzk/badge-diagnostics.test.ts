import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { ChzzkBadgeDiagnostics } from "./badge-diagnostics.js";

test("badge diagnostics are disabled by default", () => {
  const entries: unknown[] = [];
  const diagnostics = new ChzzkBadgeDiagnostics(false);

  diagnostics.record(
    { badges: [{ badgeType: "subscription" }] },
    { info: (context) => entries.push(context) }
  );

  assert.deepEqual(entries, []);
});

test("badge diagnostics log sanitized unique structures", () => {
  const entries: Array<{ context: unknown; message?: string }> = [];
  const diagnostics = new ChzzkBadgeDiagnostics(true);
  const logger = {
    info(context: unknown, message?: string) {
      entries.push({ context, message });
    }
  };
  const profile = {
    badges: [
      {
        badgeType: "subscription",
        badgeName: "Tier 1",
        imageUrl:
          "https://cdn.example.com/badges/subscription.png?token=secret#private",
        unrelated: "not logged"
      }
    ],
    verifiedMark: true,
    userRoleCode: "common_user"
  };

  diagnostics.record(profile, logger);
  diagnostics.record(profile, logger);

  assert.deepEqual(entries, [
    {
      context: {
        badgeCount: 1,
        badges: [
          {
            fields: ["badgeName", "badgeType", "imageUrl", "unrelated"],
            metadata: {
              badgeName: "Tier 1",
              badgeType: "subscription"
            },
            image: {
              host: "cdn.example.com",
              path: "/badges/subscription.png",
              fingerprint: createHash("sha256")
                .update("cdn.example.com/badges/subscription.png")
                .digest("hex")
                .slice(0, 16)
            }
          }
        ],
        verifiedMark: true,
        userRoleCode: "common_user"
      },
      message: "Chzzk badge diagnostic"
    }
  ]);
});

test("badge diagnostics ignore unsafe image URLs", () => {
  const entries: Array<{ context: unknown }> = [];
  const diagnostics = new ChzzkBadgeDiagnostics(true);

  diagnostics.record(
    { badges: [{ imageUrl: "http://example.com/badge.png?token=secret" }] },
    { info: (context) => entries.push({ context }) }
  );

  assert.deepEqual(entries, [
    {
      context: {
        badgeCount: 1,
        badges: [{ fields: ["imageUrl"], metadata: {} }],
        verifiedMark: false,
        userRoleCode: null
      }
    }
  ]);
});
