import { initializeApp, cert } from "firebase-admin/app";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync("/etc/secrets/serviceAccount.json", "utf8")
);

export const app = initializeApp({
  credential: cert(serviceAccount),
});