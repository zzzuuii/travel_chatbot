"use client";

import { useEffect, useState } from "react";

import type {
  Message,
  TravelConditions,
  TouristSpot,
  TravelData,
  PlanItem,
  SpotCandidate,
} from "../types/travel";

import {
  timeToMinutes,
  minutesToTime,
  getBudgetLimit,
  getDayOfWeek,
  getMinEndTime,
  formatDateForOneMap,
} from "../lib/travelUtils";

import TravelPlan from "./components/TravelPlan";
import TripSummary from "./components/TripSummary";
import PlanActions from "./components/PlanActions";
import PlanMap from "./components/PlanMap";

const MAX_SPOTS = 6;

// 30分単位の切り上げ
const SLOT_MINUTES = 30;

function roundUpToSlot(minutes: number) {
  return Math.ceil(minutes / SLOT_MINUTES) * SLOT_MINUTES;
}

export default function Home() {
  const [spots, setSpots] = useState<TouristSpot[]>([]);
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [endTimeError, setEndTimeError] = useState("");
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpots() {
      const response = await fetch("/api/spots");
      const data = await response.json() as TouristSpot[];
      setSpots(data);
      console.log(
        data.map((spot) => ({
          name: spot.name,
          area: spot.area,
        }))
      );
    }
    fetchSpots();
  }, []);
  const [step, setStep] = useState(0);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! What is your budget per person?",
    },
  ]);

  const [conditions, setConditions] = useState<TravelConditions>({
    budget: "",
    interests: [],
    date: "",
    time_s: "",
    time_e: "",
  });

  function getInterestScore(spot: TouristSpot) {
    const matchedCategories = spot.categories.filter((category) =>
      conditions.interests.includes(category.name)
    );

    return matchedCategories.length * 100;
  }

  function editCondition(targetStep: number) {
    setStep(targetStep);
  }

  // リセット関数
  function resetPlanner() {
    setPlan([]);

    setSavedPlanId(null);

    setConditions({
      budget: "",
      interests: [],
      date: "",
      time_s: "",
      time_e: "",
    });

    setMessages([
      {
        sender: "bot",
        text: "Hello! What is your budget per person?",
      },
    ]);

    setStep(0);
    setEndTimeError("");
  }

  function saveAsPDF() {
    window.print();
  }

  async function sharePlan() {
    try {
      let planId = savedPlanId;

      // まだDBに保存されていなければ自動保存
      if (!planId) {
        const response = await fetch("/api/plans", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            conditions,
            plan,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Failed to create share link:", data);
          return;
        }

        planId = data.id;

        setSavedPlanId(data.id);
      }

      const shareUrl =
        `${window.location.origin}/plan/${planId}`;

      await navigator.clipboard.writeText(shareUrl);

      alert("Share link copied.");

    } catch (error) {
      console.error("Failed to share plan:", error);
    }
  }

  function selectRandomFromTop5(
    candidates: SpotCandidate[]
  ): SpotCandidate | null {
    if (candidates.length === 0) {
      return null;
    }

    const sorted = [...candidates].sort(
      (a, b) => b.score - a.score
    );

    const top5 = sorted.slice(0, 5);
    const randomIndex = Math.floor(
      Math.random() * top5.length
    );

    console.log(
      "Top 5:",
      top5.map((candidate) => ({
        name: candidate.spot.name,
        score: candidate.score,
      }))
    )
    return top5[randomIndex];
  }

  // 興味の一致を判定
  function matchesInterest(spot: TouristSpot) {
    return spot.categories.some((category) =>
      conditions.interests.includes(category.name)
    );
  }
  // おすすめ時間を評価
  function getRecommendedTimeScore(
    spot: TouristSpot,
    visitTime: string
  ) {
    if (!spot.recommendedTime) {
      return 0;
    }

    if (spot.recommendedTime === "Anytime") {
      return 5;
    }

    const minutes = timeToMinutes(visitTime);

    let timePeriod = "";

    if (minutes < 12 * 60) {
      timePeriod = "Morning";
    } else if (minutes < 17 * 60) {
      timePeriod = "Afternoon";
    } else if (minutes < 22 * 60) {
      timePeriod = "Evening";
    } else {
      timePeriod = "Night";
    }

    if (spot.recommendedTime === timePeriod) {
      return 20;
    }

    return 0;
  }

  // スポット基本スコア
  function getSpotScore(
    spot: TouristSpot,
    visitTime: string
  ) {
    let score = 0;

    if (matchesInterest(spot)) {
      score += 30;
    }

    score += spot.priorityWeight;

    score += getRecommendedTimeScore(
      spot,
      visitTime
    );

    return score;
  }

  async function getTravelData(
    // 情報を受け取る
    from: TouristSpot,
    to: TouristSpot,
    date: string,
    time: string
  ) {
    const oneMapDate = formatDateForOneMap(date);
    const oneMapTime = time.length === 5 ? `${time}:00` : time;

    const url =
      `/api/route` +
      `?startLat=${from.latitude}` +
      `&startLng=${from.longitude}` +
      `&endLat=${to.latitude}` +
      `&endLng=${to.longitude}` +
      `&date=${oneMapDate}` +
      `&time=${oneMapTime}`;

    let response;
    try {
      response = await fetch(url);
    } catch (error) {
      console.error(
        "Failed to fetch route:",
        from.name,
        "→",
        to.name,
        error
      );

      return null;
    }

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Route API error:",
        response.status,
        errorText
      );

      return null;
    }

    const data = await response.json();

    // 経路なしなら静かに候補から除外
    if (data.noRoute) {
      return null;
    }

    const firstRoute =
      data.plan?.itineraries?.[0];

    if (!firstRoute) {
      return null;
    }

    if (!firstRoute) {
      return null;
    }

    // ルートの移動時間を分に変換．小数点以下を切り上げ
    const travelMinutes = Math.ceil(
      firstRoute.duration / 60
    );

    const fare = Number(firstRoute.fare);

    const transport = firstRoute.legs
      .map((leg: any) => {
        if (leg.mode === "WALK") {
          return "Walk";
        }

        if (leg.mode === "BUS") {
          return `Bus ${leg.routeShortName}`;
        }
        if (leg.mode === "SUBWAY") {
          return "MRT";
        }

        return leg.mode;
      })
      .join(" → ");

    // 1つのオブジェクトにまとめる
    const travelData = {
      travelMinutes,
      fare,
      transport,
    }

    console.log(`${from.name} → ${to.name}`, travelData);

    return travelData;

  }

  // 訪問可能スポットを絞る
  function canVisitSpot(spot: TouristSpot) {
    if (!conditions.date || !conditions.time_s || !conditions.time_e) {
      return true;
    }

    const dayOfWeek = getDayOfWeek(conditions.date);

    const openingHour = spot.openingHours.find(
      (hour) => hour.dayOfWeek === dayOfWeek
    );

    if (!openingHour) {
      return false;
    }

    if (openingHour.isClosed) {
      return false;
    }

    if (!openingHour.openTime || !openingHour.closeTime) {
      return false;
    }

    const userStart = timeToMinutes(conditions.time_s);
    const userEnd = timeToMinutes(conditions.time_e);

    const spotOpen = timeToMinutes(openingHour.openTime);

    let spotClose = timeToMinutes(openingHour.closeTime);

    if (openingHour.closesNextDay) {
      spotClose += 24 * 60;
    }

    const visitStart = Math.max(userStart, spotOpen);

    const visitEnd = visitStart + spot.stayMinutes;

    return visitEnd <= userEnd && visitEnd <= spotClose;
  }

  const availableSpots = spots.filter((spot) =>
    canVisitSpot(spot)
  );
  const rankedSpots = [...availableSpots].sort(
    (a, b) => getInterestScore(b) - getInterestScore(a)
  );
  // const candidateSpots = rankedSpots.slice(0,5);

  function sleep(ms: number) {
    return new Promise((resolve) =>
      setTimeout(resolve, ms)
    );
  }

  async function createTravelPlan() {
    if (!conditions.date || !conditions.time_s || !conditions.time_e || !conditions.budget) {
      return;
    }

    const startTime = roundUpToSlot(timeToMinutes(conditions.time_s));
    const endTime = timeToMinutes(conditions.time_e);
    const dayOfWeek = getDayOfWeek(conditions.date);
    const budgetLimit = getBudgetLimit(conditions.budget);

    // 近さの評価．Haversine式
    function getDistanceKm(from: TouristSpot, to: TouristSpot) {
      const radiusKm = 6371;
      const radians = (degrees: number) => degrees * Math.PI / 180;
      const latitudeDelta = radians(to.latitude - from.latitude);
      const longitudeDelta = radians(to.longitude - from.longitude);
      const fromLatitude = radians(from.latitude);
      const toLatitude = radians(to.latitude);
      const haversine =
        Math.sin(latitudeDelta / 2) ** 2 +
        Math.cos(fromLatitude) *
          Math.cos(toLatitude) *
          Math.sin(longitudeDelta / 2) ** 2;

      return 2 * radiusKm * Math.asin(Math.sqrt(haversine));
    }

    function getOpeningWindow(spot: TouristSpot) {
      const hours = spot.openingHours.find(
        (hour) => hour.dayOfWeek === dayOfWeek
      );

      if (!hours || hours.isClosed || !hours.openTime || !hours.closeTime) {
        return null;
      }

      const open = timeToMinutes(hours.openTime);
      let close = timeToMinutes(hours.closeTime);

      if (hours.closesNextDay) {
        close += 24 * 60;
      }

      return { open, close };
    }

    function getRouteRecommendedTimeScore(spot: TouristSpot, visitTime: number) {
      const exactScore = getRecommendedTimeScore(
        spot,
        minutesToTime(visitTime)
      );

      if (!spot.recommendedTime || spot.recommendedTime === "Anytime" || exactScore > 0) {
        return exactScore;
      }

      const windows: Record<string, { start: number; end: number }> = {
        Morning: { start: 6 * 60, end: 12 * 60 },
        Afternoon: { start: 12 * 60, end: 17 * 60 },
        Evening: { start: 17 * 60, end: 22 * 60 },
        Night: { start: 22 * 60, end: 24 * 60 },
      };
      const window = windows[spot.recommendedTime];

      if (!window) {
        return 0;
      }

      const difference =
        visitTime < window.start
          ? window.start - visitTime
          : visitTime >= window.end
            ? visitTime - window.end
            : 0;

      return Math.max(-10, 20 - difference / 30 * 2);
    }

    // 巡回順決定．全順序を作成
    function getPermutations(items: TouristSpot[]): TouristSpot[][] {
      if (items.length <= 1) {
        return [items];
      }

      const results: TouristSpot[][] = [];

      items.forEach((item, index) => {
        const rest = [...items.slice(0, index), ...items.slice(index + 1)];

        for (const permutation of getPermutations(rest)) {
          results.push([item, ...permutation]);
        }
      });

      return results;
    }

    // Select spots with the existing score and top-five randomness.
    const selectedSpots: TouristSpot[] = [];
    const selectedIds = new Set<number>();
    let entranceFees = 0;

    while (selectedSpots.length < MAX_SPOTS) {
      const candidates: SpotCandidate[] = availableSpots
      // 予算チェック
        .filter(
          (spot) =>
            !selectedIds.has(spot.id) &&
            entranceFees + spot.entranceFee <= budgetLimit
        )
        .map((spot) => {
          let proximityScore = 0;

          // 近さの評価．スコア．proximityScore
          if (selectedSpots.length > 0) {
            const nearestDistance = Math.min(
              ...selectedSpots.map((selected) => getDistanceKm(selected, spot))
            );
            const sharesArea = selectedSpots.some(
              (selected) => selected.area === spot.area
            );
            proximityScore =
              Math.max(0, 25 - nearestDistance * 3) +
              (sharesArea ? 10 : 0);
          }

          return {
            spot,
            score: getSpotScore(spot, conditions.time_s!) + proximityScore,
          };
        });

      // 上位5件からランダム選択
      const selected = selectRandomFromTop5(candidates);

      if (!selected) {
        break;
      }

      selectedSpots.push(selected.spot);
      selectedIds.add(selected.spot.id);
      entranceFees += selected.spot.entranceFee;
    }

    type EvaluatedRoute = {
      spots: TouristSpot[];
      score: number;
      distanceKm: number;
    };

    // 各巡回順を評価
    function evaluateRoute(route: TouristSpot[]): EvaluatedRoute | null {
      let currentTime = startTime;
      let distanceKm = 0;
      let recommendedScore = 0;

      for (let index = 0; index < route.length; index += 1) {
        const spot = route[index];
        const openingWindow = getOpeningWindow(spot);

        if (!openingWindow) {
          return null;
        }

        if (index > 0) {
          // 移動距離を計算
          const segmentDistance = getDistanceKm(route[index - 1], spot);
          distanceKm += segmentDistance;
          // 移動時間を概算
          currentTime += Math.ceil(segmentDistance / 22 * 60 + 8);
        }

        const visitStart = roundUpToSlot(
          Math.max(currentTime, openingWindow.open)
        );
        const visitEnd = visitStart + roundUpToSlot(spot.stayMinutes);

        // 成立しない巡回順の除外
        if (visitEnd > endTime || visitEnd > openingWindow.close) {
          return null;
        }

        // おすすめ時間を巡回順ごとに評価
        recommendedScore += getRouteRecommendedTimeScore(spot, visitStart);
        currentTime = visitEnd;
      }

      // 巡回順の最終評価
      return {
        spots: route,
        score: recommendedScore - distanceKm * 3,
        distanceKm,
      };
    }

    let spotsToOrder = [...selectedSpots];
    let evaluatedRoutes: EvaluatedRoute[] = [];
    let comparedRouteCount = 0;

    while (spotsToOrder.length > 0 && evaluatedRoutes.length === 0) {
      // 全順列を評価
      const permutations = getPermutations(spotsToOrder);
      comparedRouteCount += permutations.length;
      evaluatedRoutes = permutations
        .map(evaluateRoute)
        .filter((route): route is EvaluatedRoute => route !== null);

      if (evaluatedRoutes.length === 0) {
        spotsToOrder = spotsToOrder.slice(0, -1);
      }
    }

    // 最良ルートを選ぶ
    evaluatedRoutes.sort(
      (a, b) => b.score - a.score || a.distanceKm - b.distanceKm
    );
    const optimizedRoute = evaluatedRoutes[0]?.spots ?? [];

    console.log("Route optimization:", {
      selectedSpotCount: selectedSpots.length,
      scheduledSpotCount: optimizedRoute.length,
      comparedRouteCount,
      routeScore: evaluatedRoutes[0]?.score ?? null,
      distanceKm: evaluatedRoutes[0]?.distanceKm ?? null,
    });

    // Fetch public-transport data only for the adopted route.
    
    // OneMap取得
    const travelCache = new Map<string, TravelData | null>();

    async function getCachedTravelData(
      from: TouristSpot,
      to: TouristSpot,
      departureTime: number
    ) {
      const cacheKey = String(from.id) + "-" + String(to.id);

      if (travelCache.has(cacheKey)) {
        return travelCache.get(cacheKey) ?? null;
      }

      const travelData = await getTravelData(
        from,
        to,
        conditions.date!,
        minutesToTime(departureTime)
      );
      travelCache.set(cacheKey, travelData);

      return travelData;
    }

    const newPlan: PlanItem[] = [];
    let currentTime = startTime;
    let currentSpot: TouristSpot | null = null;
    let totalCost = 0;

    for (const spot of optimizedRoute) {
      const openingWindow = getOpeningWindow(spot);

      if (!openingWindow) {
        continue;
      }

      let travelData: TravelData | null = null;
      let arrivalTime = currentTime;

      if (currentSpot) {
        travelData = await getCachedTravelData(currentSpot, spot, currentTime);

        if (!travelData) {
          continue;
        }

        arrivalTime += travelData.travelMinutes;
      }

      const visitStart = roundUpToSlot(
        Math.max(arrivalTime, openingWindow.open)
      );
      const visitEnd = visitStart + roundUpToSlot(spot.stayMinutes);
      const nextCost =
        totalCost + spot.entranceFee + (travelData?.fare ?? 0);

      if (
        visitEnd > endTime ||
        visitEnd > openingWindow.close ||
        Number.isNaN(travelData?.fare ?? 0) ||
        nextCost > budgetLimit
      ) {
        continue;
      }

      newPlan.push({
        spot,
        startTime: minutesToTime(visitStart),
        endTime: minutesToTime(visitEnd),
        travelFromPrevious: travelData,
      });

      currentSpot = spot;
      currentTime = visitEnd;
      totalCost = nextCost;
    }

    console.log(
      "Created plan:",
      newPlan.map((item) => ({
        name: item.spot.name,
        startTime: item.startTime,
        endTime: item.endTime,
        travelMinutes: item.travelFromPrevious?.travelMinutes ?? 0,
        transport: item.travelFromPrevious?.transport ?? "Start",
      }))
    );
    console.log("FINAL PLAN LENGTH:", newPlan.length);
    console.log("Total cost:", totalCost.toFixed(2));

    setPlan(newPlan);
  }
  console.log(
    rankedSpots.map((spot) => ({
      name: spot.name,

      score: getSpotScore(
        spot,
        conditions.time_s ?? ""
      ),

      priorityWeight:
        spot.priorityWeight,

      recommendedTime:
        spot.recommendedTime,

      categories:
        spot.categories.map(
          (category) => category.name
        ),
    }))
  );

  const addMessage = (sender: "bot" | "user", text: string) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const selectBudget = (budget: string) => {
    setConditions((prev) => ({
      ...prev,
      budget,
    }));

    addMessage("user", budget);

    setTimeout(() => {
      addMessage(
        "bot",
        "What would you like to do in Singapore? You can choose multiple options."
      );
    }, 300);

    setStep(1);
  };

  const toggleInterest = (interest: string) => {
    setConditions((prev) => {
      const exists = prev.interests.includes(interest);

      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((item) => item !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  const interests = [
    "Food",
    "Shopping",
    "Landmark",
    "Culture",
    "Activities",
  ];


  const confirmInterests = () => {
    if (conditions.interests.length === 0) {
      return;
    }

    addMessage("user", conditions.interests.join(" / "));

    setTimeout(() => {

      addMessage("bot", "When will you go?");
    }, 300);

    setStep(2);
  };


  const selectDate = (date: string) => {
    setConditions((prev) => ({
      ...prev,
      date,
    }));

    addMessage("user", date);

    setTimeout(() => {
      addMessage(
        "bot", "What time will it start");
    }, 300);

    setStep(3);
  };

  const selectTime_s = (time_s: string) => {
    setConditions((prev) => ({
      ...prev,
      time_s,
    }));

    addMessage("user", time_s);

    setTimeout(() => {
      addMessage(
        "bot",
        "What time will you end"
      );
    }, 300);

    setStep(4);
  };

  const selectTime_e = (time_e: string) => {
    setConditions((prev) => ({
      ...prev,
      time_e,
    }));

    addMessage("user", time_e);

    setStep(5);
  };

  // const confirmTime = () => {
  //   if (conditions.interests.length === 0) {
  //     return;
  //   }

  //   addMessage("user", conditions.interests.join(" / "));

  //   setTimeout(() => {
  //     addMessage("bot", "Thank you! I have your basic travel conditions.");
  //     /*addMessage("bot","When will you go?");*/
  //   }, 300);

  //   setStep(7);
  // };

  useEffect(() => {
    if (step === 5 && spots.length > 0) {
      createTravelPlan();
    }
  }, [step, spots.length]);

  return (
    // <main className="min-h-screen bg-slate-100 flex justify-center p-6">
    //   <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg">

    //画面を2カラムに分割する 
    <main
      className="
        min-h-screen
        bg-slate-50
        p-6
        lg:h-screen
        lg:overflow-hidden

        print:bg-white
        print:p-0
        print:h-auto
        print:overflow-visible
      "
    >
      <div
        className="
          mx-auto
          max-w-[1600px]
        "
      >
        <header
          className="
            grid
            sticky
            top-0
            z-40
            min-h-20
            grid-cols-1
            items-center
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-sm
            lg:h-20
            lg:grid-cols-[440px_minmax(0,1fr)]
            print:hidden
          "
        >
          <div className="flex h-full items-center px-5 lg:border-r lg:border-slate-200">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Singapore Travel Planner
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                I suggest a sightseeing plan for you.
              </p>
            </div>
          </div>

          <div className="flex h-full items-center justify-end px-5 lg:px-6">
            {step === 5 && (
              <PlanActions
                onPlanAnotherTrip={resetPlanner}
                onShare={sharePlan}
                onSavePDF={saveAsPDF}
              />
            )}
          </div>
        </header>

        <div
          className="
            mt-3
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-[440px_minmax(0,1fr)]
            lg:h-[calc(100vh-8.75rem)]
            lg:overflow-hidden
            print:block
            print:h-auto
            print:overflow-visible
          "
        >
        {/* 左側 */}
        <section
          className="
          bg-white
          border
          border-slate-200
          rounded-3xl
          shadow-sm
          overflow-hidden
          lg:h-full
          flex
          flex-col
          print:hidden
        "
        >
          {/* Chat */}
          {/* p-5 space-y-4 overflow-y-auto flex-1でスクロール可 */}
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.sender === "bot"
                    ? "flex justify-start"
                    : "flex justify-end"
                }
              >
                <div
                  className={
                    message.sender === "bot"
                      // bot用デザイン
                      ? `
                        bg-white
                        border
                        border-slate-400
                        shadow-sm
                        px-4
                        py-3
                        rounded-2xl
                        rounded-bl-md
                        max-w-[85%]
                        text-sm
                        text-slate-800
                      `
                      // user用のデザイン
                      : `
                        bg-blue-50
                        border
                        border-blue-200
                        px-4
                        py-3
                        rounded-2xl
                        rounded-br-md
                        max-w-[80%]
                        text-sm
                        text-slate-900
                      `
                  }
                >
                  {message.text}
                </div>
              </div>
            ))}

            {/* Number of people */}
            {/* {step === 0 && (
            <div className="flex flex-wrap gap-2">
              {["1 person", "2 people", "3-4 people", "5+ people"].map(
                (people) => (
                  <button
                    key={people}
                    onClick={() => selectPeople(people)}
                    className="border px-4 py-2 rounded-full hover:bg-gray-100"
                  >
                    {people}
                  </button>
                )
              )}
            </div>
          )} */}

            {/* Budget */}
            {step === 0 && (
              <div className="flex flex-wrap gap-2">
                {[
                  "Around S$30",
                  "Around S$50",
                  "Around S$100",
                  "More than S$100",
                ].map((budget) => (
                  <button
                    key={budget}
                    onClick={() => selectBudget(budget)}
                    className="
                      border
                      border-slate-400
                      bg-white
                      px-4
                      py-2.5
                      rounded-xl
                      text-sm
                      text-slate-700
                      hover:border-blue-400
                      hover:bg-blue-50
                      transition
                    "
                  >
                    {budget}
                  </button>
                ))}
              </div>
            )}

            {/* Interests */}
            {step === 1 && (
              <div>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => {
                    const selected =
                      conditions.interests.includes(interest);

                    return (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={
                          selected
                            // 選択
                            ? `
                              border
                              border-blue-500
                              bg-blue-50
                              text-blue-700
                              px-4
                              py-2.5
                              rounded-xl
                              text-sm
                              font-medium
                            `
                            // 未選択
                            : `
                              border
                              border-slate-400
                              bg-white
                              text-slate-700
                              px-4
                              py-2.5
                              rounded-xl
                              text-sm
                              hover:border-blue-400
                              hover:bg-blue-50
                              transition
                            `
                        }
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={confirmInterests}
                  disabled={conditions.interests.length === 0}
                  className="mt-4 bg-black text-white px-5 py-2 rounded-xl disabled:bg-gray-300"
                >
                  Confirm
                </button>
              </div>
            )}

            {/* Date */}
            {step === 2 && (
              <div>
                <input
                  type="date"
                  value={conditions.date ?? ""}
                  onChange={(e) => {
                    const value = e.currentTarget.value;

                    setConditions((prev) => ({
                      ...prev,
                      date: value,
                    }));
                  }}
                  className="border px-4 py-2 rounded-xl"
                />

                <button
                  onClick={() => {
                    if (conditions.date) {
                      selectDate(conditions.date);
                    }
                  }}
                  disabled={!conditions.date}
                  className="ml-2 bg-black text-white px-4 py-2 rounded-xl disabled:bg-gray-300"
                >
                  Confirm
                </button>
              </div>
            )}

            {/* Start Time */}
            {step === 3 && (
              <div>
                <input
                  type="time"
                  value={conditions.time_s ?? ""}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    setConditions((prev) => ({
                      ...prev,
                      time_s: value,
                    }));
                  }}
                  className="border px-4 py-2 rounded-xl"
                />

                <button
                  onClick={() => {
                    if (conditions.time_s) {
                      selectTime_s(conditions.time_s);
                    }
                  }}
                  disabled={!conditions.time_s}
                  className="ml-2 bg-black text-white px-4 py-2 rounded-xl disabled:bg-gray-300"
                >
                  Confirm
                </button>
              </div>
            )}

            {/* End Time */}
            {step === 4 && (
              <div>
                <input
                  type="time"

                  min={
                    conditions.time_s
                      ? getMinEndTime(conditions.time_s)
                      : undefined
                  }
                  value={conditions.time_e ?? ""}
                  onChange={(e) => {
                    const value = e.currentTarget.value;

                    if (!conditions.time_s) {
                      return;
                    }

                    const start = timeToMinutes(conditions.time_s);
                    const end = timeToMinutes(value);

                    if (end <= start) {
                      setEndTimeError(
                        "Please select an end time later than the start time"
                      );
                      return;
                    }
                    setEndTimeError("");

                    setConditions((prev) => ({
                      ...prev,
                      time_e: value,
                    }));
                  }}
                  className="border px-4 py-2 rounded-xl"
                />

                <button
                  onClick={() => {
                    if (conditions.time_e) {
                      selectTime_e(conditions.time_e);
                    }
                  }}
                  disabled={!conditions.time_e}
                  className="ml-2 bg-black text-white px-4 py-2 rounded-xl disabled:bg-gray-300"
                >
                  Confirm
                </button>
                {endTimeError && (
                  <p className="text-red-500 text-sm mt-2">
                    {endTimeError}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 右側 */}
        <section
          className="
            min-w-0
            space-y-3
            lg:h-full
            lg:overflow-y-auto
            print:w-full
            print:h-auto
            print:overflow-visible
            print:space-y-3
          "
        >
          <div className="hidden print:block mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Singapore Travel Plan
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Your personalized one-day itinerary
            </p>
          </div>

          {/* 入力中に表示する右側 */}
          {step !== 5 && (
             <TripSummary conditions={conditions} />
          )}

          {step === 5 && (
            <>
              {/* Current conditions */}
              <TripSummary conditions={conditions} />
              
              <PlanMap plan={plan} />
              
              <TravelPlan plan={plan} />
            </>
          )}
          {/* <PlanMap plan={plan} />
          <TravelPlan plan={plan} /> */}
        </section>
        </div>
      </div>
    </main >
  );
}
