/**
 * set-storage-cors.mjs — configure CORS on the Firebase Storage bucket
 * so that browser clients (admin CMS) can upload images directly.
 *
 * Run: node --env-file=.env.local scripts/set-storage-cors.mjs
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString("utf8")
);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = getStorage().bucket();
console.log("Bucket:", bucket.name);

const corsConfig = [
  {
    origin: [
      "http://localhost:3000",
      "https://masaremaar.vercel.app",
      "https://masaremaar.com",
      "https://www.masaremaar.com",
    ],
    method: ["GET", "HEAD", "PUT", "POST", "DELETE"],
    responseHeader: [
      "Content-Type",
      "Authorization",
      "x-goog-resumable",
      "x-goog-meta-*",
    ],
    maxAgeSeconds: 3600,
  },
];

await bucket.setCorsConfiguration(corsConfig);
console.log("CORS set successfully:", JSON.stringify(corsConfig, null, 2));
