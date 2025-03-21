export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = 10; // Limit per page

    if (!employeeId) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
    }

    // Extract date filters
    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined;
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined;

    // Get filtered screenshots
    const screenshots = await prisma.screenShotModel.findMany({
      where: {
        employeeId: employeeId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { date: "desc" },
    });

    // ✅ Count total filtered screenshots (Fixes totalPages issue)
    const totalCount = await prisma.screenShotModel.count({
      where: {
        employeeId: employeeId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const formattedScreenshots = screenshots.map((screenshot) => ({
      id: screenshot.id,
      image: screenshot.picture
        ? `data:image/png;base64,${Buffer.from(screenshot.picture).toString("base64")}`
        : null,
      createdAt: screenshot.date,
    }));

    return NextResponse.json({ 
      screenshots: formattedScreenshots, 
      totalPages: Math.ceil(totalCount / pageSize), // ✅ Now updates correctly
      currentPage: page
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching screenshots:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
