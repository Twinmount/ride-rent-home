export default function ZeroDeposit({ enabled }: { enabled: boolean }) {
  if (!enabled) {
    return null;
  }

  return (
    <div className="absolute left-2 bottom-2 inline-flex py-[0.3rem] animate-shimmer border border-slate-500 items-center justify-center rounded-[0.5rem] shadow bg-[linear-gradient(110deg,#b78628,35%,#ffd700,45%,#fffacd,55%,#b78628)] bg-[length:200%_100%] px-2 font-medium text-yellow-300 transition-colors focus:outline-none text-xs">
      Zero Deposit
    </div>
  );
}
