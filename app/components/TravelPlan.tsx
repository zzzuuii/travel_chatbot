import type { PlanItem } from "../../types/travel";

function getSpotImage(spotName: string) {
    const images: Record<string, string> = {
        "Gardens by the Bay": "/photo/garden.jpg",
        "Bugis Street": "/photo/bugis.jpg",
        "Merlion Park": "/photo/malion.jpg",
        "Lau Pa Sat": "/photo/laubasa.jpg",
        "Haji Lane": "/photo/haji.jpg",
        "Satay by the Bay": "/photo/satay.jpg",
    };

    return images[spotName] ?? null;
}

type Props = {
    plan: PlanItem[];
};

export default function TravelPlan({
    plan,
}: Props) {
    if (plan.length === 0) {
        return null;
    }

    return (
        <div className="mt-6 w-full min-w-0">
            <h2 className="mb-6 text-xl font-bold text-slate-900">
                Your Travel Plan
            </h2>

            <div>
                {plan.map((item, index) => (
                    <div
                        key={item.spot.id}
                        className="relative"
                    >
                        <div className="flex gap-4">

                            {/* 番号 + 青いタイムライン */}
                            <div className="relative w-9 shrink-0 flex justify-center">

                                {/* 青い線 */}
                                {index < plan.length - 1 && (
                                    <div
                                        className="
                                            absolute
                                            top-9
                                            -bottom-10
                                            w-0.5
                                            bg-blue-300
                                        "
                                    />
                                )}

                                {/* 番号 */}
                                <div
                                    className="
                                        relative
                                        z-10
                                        w-9
                                        h-9
                                        rounded-full
                                        bg-blue-600
                                        text-white
                                        flex
                                        items-center
                                        justify-center
                                        text-sm
                                        font-bold
                                    "
                                >
                                    {index + 1}
                                </div>

                            </div>


                            {/* 観光地カード */}
                            <div
                                className="
                                    flex-1
                                    border
                                    border-slate-200
                                    rounded-xl
                                    bg-white
                                    px-5
                                    py-4
                                    print:break-inside-avoid
                                "
                            >

                                <div className="flex gap-4">

                                    {/* 写真 */}
                                    <div
                                        className="
                                            w-28
                                            h-20
                                            shrink-0
                                            rounded-lg
                                            bg-slate-100
                                            border
                                            border-slate-200
                                            overflow-hidden
                                        "
                                    >
                                        {getSpotImage(item.spot.name) ? (
                                            <img
                                                src={getSpotImage(item.spot.name)!}
                                                alt={item.spot.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div
                                                className="
                                                    w-full
                                                    h-full
                                                    flex
                                                    items-center
                                                    justify-center
                                                    text-sm
                                                    text-slate-400
                                                "
                                            >
                                                No photo
                                            </div>
                                        )}
                                    </div>


                                    {/* 観光地情報 */}
                                    <div className="min-w-0 flex-1">

                                        <div className="flex items-start justify-between gap-4">

                                            <h3 className="text-base font-semibold text-slate-900">
                                                {item.spot.name}
                                            </h3>

                                            <p className="text-base font-medium text-slate-700 whitespace-nowrap">
                                                {item.startTime} - {item.endTime}
                                            </p>

                                        </div>

                                        <div
                                            className="
                                                mt-2
                                                flex
                                                flex-wrap
                                                gap-x-5
                                                gap-y-1
                                                text-sm
                                                text-slate-600
                                            "
                                        >
                                            <span>
                                                {item.spot.area}
                                            </span>

                                            <span>
                                                Stay: {item.spot.stayMinutes} min
                                            </span>

                                            <span>
                                                Entrance: S${item.spot.entranceFee}
                                            </span>

                                            {item.spot.categories.length > 0 && (
                                                <span>
                                                    {item.spot.categories
                                                        .map((category) => category.name)
                                                        .join(" / ")}
                                                </span>
                                            )}
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>


                        {/* 次の観光地までの移動情報 */}
                        {index < plan.length - 1 &&
                            plan[index + 1].travelFromPrevious && (

                                <div
                                    className="
                                        ml-[52px]
                                        py-3
                                        text-sm
                                        text-slate-500
                                        print:break-inside-avoid
                                    "
                                >
                                    {plan[index + 1].travelFromPrevious?.transport}

                                    {" · "}

                                    {plan[index + 1].travelFromPrevious?.travelMinutes} min

                                    {" · "}

                                    S$
                                    {plan[index + 1].travelFromPrevious?.fare.toFixed(2)}
                                </div>

                            )}
                    </div>
                ))}
            </div>
        </div>
    );
}
