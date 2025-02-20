export default function ZeroDeposit({ enabled }: { enabled: boolean }) {
  if (enabled) {
    return null;
  }

  return (
    <div className="text-yellow-300 absolute bottom-2 left-2 inline-flex animate-shimmer items-center justify-center rounded-[0.5rem] border border-slate-500 bg-[linear-gradient(110deg,#b78628,35%,#ffd700,45%,#fffacd,55%,#b78628)] bg-[length:200%_100%] px-2 py-[0.3rem] text-xs font-medium shadow transition-colors focus:outline-none">
      Zero Deposit
    </div>
  );
}
