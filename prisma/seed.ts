import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seed: 文章请使用 content/articles/*.md（Git）或后台 /admin 写入数据库。");
  console.log("如需示例用户，可在此脚本中自行添加 prisma.user.create。");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
