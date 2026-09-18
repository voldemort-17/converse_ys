import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, resolve } from "node:path";

function getPrismaCompatibleCaPath(caFile: string) {
  const source = resolve(caFile);
  if (!/\s/.test(source)) return source;

  // Prisma's MongoDB connector serializes spaces in tlsCAFile paths as `+`.
  // Copy the public CA bundle to a path without spaces so Windows workspaces
  // such as OneDrive directories remain usable without weakening TLS checks.
  const targetDirectory = resolve(tmpdir(), "converse-ys");
  if (/\s/.test(targetDirectory)) {
    throw new Error(
      "The MongoDB CA certificate must be stored in a path without spaces.",
    );
  }

  mkdirSync(targetDirectory, { recursive: true });
  const target = resolve(targetDirectory, `${process.pid}-${basename(source)}`);
  copyFileSync(source, target);
  return target;
}

export function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");

  const configuredCa = process.env.MONGODB_TLS_CA_FILE;
  const localCa = ".certs/mongodb-ca.pem";
  const caFile = configuredCa
    ? configuredCa
    : existsSync(resolve(process.cwd(), localCa))
      ? localCa
      : null;
  if (!caFile) return databaseUrl;

  const compatibleCaFile = getPrismaCompatibleCaPath(caFile);

  const url = new URL(databaseUrl);
  if (url.searchParams.has("tlsCAFile")) {
    return databaseUrl;
  }

  const separator = databaseUrl.includes("?") ? "&" : "?";
  const encodedCaFile = encodeURIComponent(
    compatibleCaFile.replaceAll("\\", "/"),
  );

  return `${databaseUrl}${separator}tlsCAFile=${encodedCaFile}`;
}
