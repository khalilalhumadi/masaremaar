#!/usr/bin/env node
/**
 * set-admin-claim.mjs
 * One-time script to grant admin access to a Firebase Auth user.
 *
 * Prerequisites:
 *   1. Create .env.local with FIREBASE_SERVICE_ACCOUNT set (copy from Vercel env vars).
 *   2. Get the user's UID from Firebase Console → Authentication → Users.
 *
 * Usage (Node 20+):
 *   node --env-file=.env.local scripts/set-admin-claim.mjs <uid>
 *
 * Example:
 *   node --env-file=.env.local scripts/set-admin-claim.mjs abc123XYZ
 *
 * To revoke admin access (pass --revoke flag):
 *   node --env-file=.env.local scripts/set-admin-claim.mjs abc123XYZ --revoke
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const uid = process.argv[2];
const revoke = process.argv.includes("--revoke");

if (!uid || uid.startsWith("--")) {
  console.error("Usage: node --env-file=.env.local scripts/set-admin-claim.mjs <uid> [--revoke]");
  process.exit(1);
}

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccount) {
  console.error(
    "Error: FIREBASE_SERVICE_ACCOUNT env var is not set.\n" +
    "Run: node --env-file=.env.local scripts/set-admin-claim.mjs <uid>"
  );
  process.exit(1);
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert(
        JSON.parse(Buffer.from(serviceAccount, "base64").toString("utf8"))
      ),
    });

const auth = getAuth(app);

try {
  const claims = revoke ? { admin: false } : { admin: true };
  await auth.setCustomUserClaims(uid, claims);

  const user = await auth.getUser(uid);
  const action = revoke ? "Revoked admin claim from" : "Granted admin claim to";
  console.log(`✓ ${action}: ${user.email} (uid: ${uid})`);

  if (!revoke) {
    console.log("\nNext step: the user must sign out and sign back in for the new claim to take effect.");
  }
} catch (err) {
  console.error("Failed:", err.message);
  process.exit(1);
}
