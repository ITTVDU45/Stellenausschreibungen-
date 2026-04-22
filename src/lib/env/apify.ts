import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export interface ApifyConfig {
  apiToken: string | null;
  actorId: string | null;
  baseUrl: string;
  datasetLimitDefault: number;
}

type FallbackEnvValues = Record<string, string>;

function parseEnvFile(contents: string): FallbackEnvValues {
  return contents.split(/\r?\n/).reduce<FallbackEnvValues>((accumulator, line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) {
      return accumulator;
    }

    const separatorIndex = trimmedLine.indexOf("=");
    if (separatorIndex === -1) {
      return accumulator;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (key) {
      accumulator[key] = value;
    }

    return accumulator;
  }, {});
}

function loadFallbackEnvValues(): FallbackEnvValues {
  const files = [path.join(process.cwd(), ".env.local"), path.join(process.cwd(), "src", ".env.local")];

  return files.reduce<FallbackEnvValues>((accumulator, filePath) => {
    if (!existsSync(filePath)) {
      return accumulator;
    }

    return {
      ...accumulator,
      ...parseEnvFile(readFileSync(filePath, "utf8")),
    };
  }, {});
}

function resolveEnvValue(keys: string[], fallbackEnv: FallbackEnvValues) {
  for (const key of keys) {
    const runtimeValue = process.env[key]?.trim();
    if (runtimeValue) {
      return runtimeValue;
    }
  }

  for (const key of keys) {
    const fallbackValue = fallbackEnv[key]?.trim();
    if (fallbackValue) {
      return fallbackValue;
    }
  }

  return null;
}

export function getApifyConfig(): ApifyConfig {
  const fallbackEnv = loadFallbackEnvValues();
  const datasetLimit = resolveEnvValue(["APIFY_DATASET_LIMIT_DEFAULT"], fallbackEnv);

  return {
    apiToken: resolveEnvValue(["APIFY_API_TOKEN", "Personal_API_tokens"], fallbackEnv),
    actorId: resolveEnvValue(["APIFY_ACTOR_ID"], fallbackEnv),
    baseUrl: resolveEnvValue(["APIFY_BASE_URL"], fallbackEnv) ?? "https://api.apify.com",
    datasetLimitDefault: Number(datasetLimit ?? 100),
  };
}

export function isApifyConfigured() {
  const config = getApifyConfig();
  return Boolean(config.apiToken);
}

export function getApifyConfigSignature() {
  return JSON.stringify(getApifyConfig());
}
