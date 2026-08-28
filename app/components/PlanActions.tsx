type Props = {
  onPlanAnotherTrip: () => void;
  onShare: () => void;
  onSavePDF: () => void;
};

export default function PlanActions({
  onPlanAnotherTrip,
  onShare,
  onSavePDF,
}: Props) {
  return (
    <div
      className="flex flex-wrap justify-end gap-2 print:hidden"
      aria-label="Plan actions"
    >
      <button
        onClick={onSavePDF}
        className="
            border
            border-slate-300
            bg-white
            px-4
            py-2
            rounded-xl
            text-sm
            font-medium
            text-slate-700
            hover:bg-slate-50
            disabled:opacity-40
            disabled:cursor-not-allowed
            transition
            "
      >
        Save
      </button>

      <button
        onClick={onShare}
        className="
            border
            border-slate-300
            bg-white
            px-4
            py-2
            rounded-xl
            text-sm
            font-medium
            text-slate-700
            hover:bg-slate-50
            transition
        "
      >
        Share
      </button>

      <button
        onClick={onPlanAnotherTrip}
        className="
          border
          border-slate-300
          bg-white
          px-4
          py-2
          rounded-xl
          text-sm
          font-medium
          text-slate-700
          hover:bg-slate-50
          transition
        "
      >
        Regenerate
      </button>

    </div>
  );
}
