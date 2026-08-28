import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(request: Request) {
  try {

    // 送られてきたデータを取得
    const body = await request.json();

    const {
      conditions,
      plan,
    } = body;

    const savedPlan = await prisma.savedPlan.create({
      // DBへの保存
      data: {
        budget: conditions.budget,
        interests: JSON.stringify(conditions.interests),

        date: conditions.date,
        startTime: conditions.time_s,
        endTime: conditions.time_e,

        items: {
          create: plan.map(
            (item: any, index: number) => ({
              order: index + 1,

              startTime: item.startTime,
              endTime: item.endTime,

              travelMinutes:
                item.travelFromPrevious?.travelMinutes ?? null,

              fare:
                item.travelFromPrevious?.fare ?? null,

              transport:
                item.travelFromPrevious?.transport ?? null,

              touristSpotId: item.spot.id,
            })
          ),
        },
      },

      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      id: savedPlan.id,
    });

  } catch (error) {
    console.error("Failed to save plan:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save plan",
      },
      {
        status: 500,
      }
    );
  }
}