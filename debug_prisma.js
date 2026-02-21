import { PrismaClient } from '@prisma/client';

try {
  const p1 = new PrismaClient({
    datasourceUrl: "postgresql://dummy:dummy@localhost/dummy"
  });
  console.log("datasourceUrl SUCCESS");
} catch (e) {
  console.log("datasourceUrl FAILED:", e.message);
}

try {
  const p2 = new PrismaClient({
    datasources: { db: { url: "postgresql://dummy:dummy@localhost/dummy" } }
  });
  console.log("datasources SUCCESS");
} catch (e) {
  console.log("datasources FAILED:", e.message);
}
