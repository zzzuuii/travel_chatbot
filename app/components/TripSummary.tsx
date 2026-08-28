import type { TravelConditions } from "../../types/travel";

type Props = {
  conditions: TravelConditions;
};

export default function TripSummary({
  conditions,
}: Props) {
  return (
    <div
      className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        px-5
        py-4
        shadow-sm
        print:shadow-none
        print:break-inside-avoid
      "
    >
      <div className="mb-3">
        <h2 className="text-xl font-bold text-slate-900">
          Your Trip
        </h2>
      </div>

      <div
        className="
          grid
          grid-cols-2
          lg:grid-cols-4
          gap-4
        "
      >
        {/* Budget */}
        <div>
          <p className="text-sm text-slate-500">
            Budget
          </p>

          <p className="font-medium text-slate-900">
            {conditions.budget || "—"}
          </p>
        </div>

        {/* Interests */}
        <div>
          <p className="text-sm text-slate-500">
            Interests
          </p>

          <p className="font-medium text-slate-900">
            {conditions.interests.length > 0
              ? conditions.interests.join(" / ")
              : "—"}
          </p>
        </div>

        {/* Date */}
        <div>
          <p className="text-sm text-slate-500">
            Date
          </p>

          <p className="font-medium text-slate-900">
            {conditions.date || "—"}
          </p>
        </div>

        {/* Time */}
        <div>
          <p className="text-sm text-slate-500">
            Time
          </p>

          <p className="font-medium text-slate-900">
            {conditions.time_s || "—"}
            {conditions.time_e
              ? ` - ${conditions.time_e}`
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
}