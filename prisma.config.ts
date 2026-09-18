import { config } from "dotenv";
import { defineConfig } from "prisma/config";
import { getDatabaseUrl } from "./lib/database-url";

config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: getDatabaseUrl(),
  },
});
