import { notFound } from "next/navigation";

import prisma from "../../../lib/prisma";

import TripSummary from "../../components/TripSummary";
import PlanMap from "../../components/PlanMap";
import TravelPlan from "../../components/TravelPlan";

import type {
  PlanItem,
  TravelConditions,
} from "../../../types/travel";


type Props = {
  params: Promise<{
    id: string;
  }>;
};


export default async function SavedPlanPage({
  params,
}: Props) {

  // URLから保存プランのIDを取得
  const { id } = await params;


  // DBから保存済みプランを取得
  const savedPlan = await prisma.savedPlan.findUnique({
    where: {
      id: id,
    },

    include: {
      items: {
        orderBy: {
          order: "asc",
        },

        include: {
          touristSpot: {
            include: {
              categories: true,
              openingHours: true,
            },
          },
        },
      },
    },
  });


  // 該当するプランが存在しなかった場合
  if (!savedPlan) {
    notFound();
  }


  // DBの旅行条件をTravelConditions型へ戻す
  const conditions: TravelConditions = {
    budget: savedPlan.budget,
    interests: JSON.parse(savedPlan.interests),
    date: savedPlan.date,
    time_s: savedPlan.startTime,
    time_e: savedPlan.endTime,
  };


  // SavedPlanItemを通常のPlanItem型へ戻す
  const plan: PlanItem[] = savedPlan.items.map((item) => ({
    spot: item.touristSpot,

    startTime: item.startTime,
    endTime: item.endTime,

    travelFromPrevious:
      item.travelMinutes === null &&
      item.fare === null &&
      item.transport === null
        ? null
        : {
            travelMinutes:
              item.travelMinutes ?? 0,

            fare:
              item.fare ?? 0,

            transport:
              item.transport ?? "",
          },
  }));


  return (
    <main className="min-h-screen bg-slate-50 p-6">

      <div className="mx-auto max-w-5xl space-y-6">

        <TripSummary
          conditions={conditions}
        />

        <PlanMap
          plan={plan}
        />

        <TravelPlan
          plan={plan}
        />

      </div>

    </main>
  );
}