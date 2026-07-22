// Test stub for "@/lib/prisma". The pure functions under test never touch the
// database; this keeps unit tests offline (no connection, no generated client).
export const prisma = new Proxy(
  {},
  {
    get() {
      throw new Error("prisma should not be called in unit tests");
    },
  }
);
