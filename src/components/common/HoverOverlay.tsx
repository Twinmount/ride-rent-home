import { ExternalLink } from "lucide-react";

export default function HoverOverlay({
  label = "Visit",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100 ${className}`}
    >
      <span className="flex-center gap-x-1 text-xl font-semibold text-white hover:text-yellow">
        {label} <ExternalLink width={20} height={20} />
      </span>
    </div>
  );
}
