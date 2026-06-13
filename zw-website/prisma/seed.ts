import { PrismaClient, PublishStatus } from "@prisma/client";
import { products, timeline, videos } from "../src/data/content";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      companyName: "中网华信科技股份有限公司",
      hotline: "0351-8330236",
      address: "山西省太原市综改示范区南中环街529号D座20层",
      icp: "晋B2-20050002-2",
    },
  });

  for (const [index, product] of products.entries()) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        category: product.category,
        summary: product.summary,
        content: { highlights: product.highlights },
        reportUrl: product.report,
        status: PublishStatus.PUBLISHED,
        featured: true,
        sortOrder: index,
        publishedAt: new Date(),
      },
    });
  }

  for (const [index, item] of videos.entries()) {
    await prisma.video.upsert({
      where: { slug: `video-${index + 1}` },
      update: {},
      create: {
        title: item.title,
        slug: `video-${index + 1}`,
        category: item.type,
        sourceUrl: item.src,
        status: PublishStatus.PUBLISHED,
        featured: index < 4,
        sortOrder: index,
        publishedAt: new Date(),
      },
    });
  }

  for (const [yearIndex, item] of timeline.entries()) {
    for (const [eventIndex, event] of item.events.entries()) {
      const existing = await prisma.timelineEvent.findFirst({
        where: { year: item.year, title: event.title },
      });
      if (!existing) {
        await prisma.timelineEvent.create({
          data: {
            year: item.year,
            title: event.title,
            detail: event.category,
            sortOrder: yearIndex * 10 + eventIndex,
          },
        });
      }
    }
  }
}

main().finally(() => prisma.$disconnect());
