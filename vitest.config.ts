import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Resolve the "@/*" alias from tsconfig.json so tests import like the app.
    tsconfigPaths: true,
    alias: {
      // The analytics module imports the Prisma client at module scope (only for
      // the DB helper, not the pure math). Stub it so unit tests stay fully
      // offline and don't need a database or generated client.
      "@/lib/prisma": fileURLToPath(
        new URL("./src/test/prisma-stub.ts", import.meta.url)
      ),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
