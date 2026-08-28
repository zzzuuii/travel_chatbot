"use client";

import dynamic from "next/dynamic";

import type { PlanItem } from "../../types/travel";

// ブラウザ側だけで実行する
const PlanMapClient = dynamic(
  () => import("./PlanMapClient"),
  {
    ssr: false,
  }
);

type Props = {
  plan: PlanItem[];
};

export default function PlanMap({
  plan,
}: Props) {
// プランがないなら何も表示しない
  if (plan.length === 0) {
    return null;
  }

  return (
    <div
        className="
            bg-white
            border
            border-slate-200
            rounded-xl
            p-4
            shadow-sm

            print:shadow-none
            print:break-inside-avoid
        "
    >
      <h2 className="mb-3 text-xl font-bold text-slate-900">
        Your Map
      </h2>

      <PlanMapClient plan={plan} />
    </div>
  );
}