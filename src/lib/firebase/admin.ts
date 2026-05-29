// admin.ts — Firebase Admin SDK singleton (server-only)
// Used by Server Components and Server Actions to read/write Firestore
// using the service account (bypasses Firestore security rules).
// NEVER imported by client components — the "server-only" package enforces this.

import "server-only";
import {
  initializeApp,
  getApps,
  cert,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getStorage, type Storage } from "firebase-admin/storage";

function getAdminApp(): App {
  if (getApps().length) return getApps()[0];

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccount) {
    // During build or local dev without credentials, return a placeholder.
    // Server Actions / data-fetch functions that need the Admin SDK must
    // check for this and fall back to static content.ts data.
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT env var is not set. " +
        "Add it to .env.local (locally) or to Vercel environment variables."
    );
  }

  const credential = cert(
    JSON.parse(Buffer.from(serviceAccount, "base64").toString("utf8"))
  );

  return initializeApp({ credential });
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function getAdminStorage(): Storage {
  return getStorage(getAdminApp());
}

/** Returns true if the Admin SDK is configured (env var present). */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);
}
